// Meditation session type
export interface MeditationSession {
  id: string;
  date: string;
  duration: number; // in seconds
  type: string;
  moodBefore: number; // 1-5 scale
  moodAfter: number; // 1-5 scale
  notes?: string;
}

// Journal entry type
export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
}

// App statistics type
export interface AppStats {
  totalMinutes: number;
  totalToday: number;
  minutesThisWeek: number;
  currentStreak: number;
  longestStreak: number;
  averageSessionLength: number;
}

// Breathing pattern type
export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number; // seconds
  hold1: number; // seconds
  exhale: number; // seconds
  hold2: number; // seconds
}

// Meditation type
export interface MeditationType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// Export types from other files in the types directory
export * from './meditation';