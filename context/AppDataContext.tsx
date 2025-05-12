import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MeditationSession, JournalEntry, AppStats } from '@/types';
import { calculateSessionStats } from '@/utils/statsHelpers';

// Context type definition
type AppDataContextType = {
  sessions: MeditationSession[];
  journalEntries: JournalEntry[];
  stats: AppStats;
  addSession: (session: MeditationSession) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (entry: JournalEntry) => void;
  deleteJournalEntry: (id: string) => void;
  resetAllData: () => void;
};

// Default values
const defaultStats: AppStats = {
  totalMinutes: 0,
  totalToday: 0,
  minutesThisWeek: 0,
  currentStreak: 0,
  longestStreak: 0,
  averageSessionLength: 0,
};

// Create context with default values
const AppDataContext = createContext<AppDataContextType>({
  sessions: [],
  journalEntries: [],
  stats: defaultStats,
  addSession: () => {},
  addJournalEntry: () => {},
  updateJournalEntry: () => {},
  deleteJournalEntry: () => {},
  resetAllData: () => {},
});

// Provider component
export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState<AppStats>(defaultStats);

  // Load data from AsyncStorage on initial render
  useEffect(() => {
    const loadData = async () => {
      try {
        const sessionsData = await AsyncStorage.getItem('meditation_sessions');
        const journalData = await AsyncStorage.getItem('journal_entries');
        
        if (sessionsData) {
          const loadedSessions = JSON.parse(sessionsData);
          setSessions(loadedSessions);
        }
        
        if (journalData) {
          const loadedEntries = JSON.parse(journalData);
          setJournalEntries(loadedEntries);
        }
      } catch (error) {
        console.error('Failed to load data from storage', error);
      }
    };
    
    loadData();
  }, []);

  // Update stats whenever sessions change
  useEffect(() => {
    setStats(calculateSessionStats(sessions));
    
    // Save sessions to AsyncStorage
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('meditation_sessions', JSON.stringify(sessions));
      } catch (error) {
        console.error('Failed to save sessions to storage', error);
      }
    };
    
    saveData();
  }, [sessions]);

  // Save journal entries to AsyncStorage when they change
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('journal_entries', JSON.stringify(journalEntries));
      } catch (error) {
        console.error('Failed to save journal entries to storage', error);
      }
    };
    
    saveData();
  }, [journalEntries]);

  // Add a new meditation session
  const addSession = (session: MeditationSession) => {
    setSessions((prevSessions) => [session, ...prevSessions]);
  };

  // Add a new journal entry
  const addJournalEntry = (entry: JournalEntry) => {
    setJournalEntries((prevEntries) => [entry, ...prevEntries]);
  };

  // Update an existing journal entry
  const updateJournalEntry = (updatedEntry: JournalEntry) => {
    setJournalEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
  };

  // Delete a journal entry
  const deleteJournalEntry = (id: string) => {
    setJournalEntries((prevEntries) =>
      prevEntries.filter((entry) => entry.id !== id)
    );
  };

  // Reset all app data
  const resetAllData = () => {
    setSessions([]);
    setJournalEntries([]);
    setStats(defaultStats);
    
    // Clear AsyncStorage data
    const clearData = async () => {
      try {
        await AsyncStorage.multiRemove(['meditation_sessions', 'journal_entries']);
      } catch (error) {
        console.error('Failed to clear data from storage', error);
      }
    };
    
    clearData();
  };

  return (
    <AppDataContext.Provider
      value={{
        sessions,
        journalEntries,
        stats,
        addSession,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        resetAllData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

// Custom hook to use the app data context
export const useAppData = () => useContext(AppDataContext);