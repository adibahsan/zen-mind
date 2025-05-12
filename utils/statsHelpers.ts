import { MeditationSession, AppStats } from '@/types';
import { isToday, isSameDay } from './dateHelpers';

// Calculate total minutes from seconds
export const calculateTotalMinutes = (sessions: MeditationSession[]): number => {
  const totalSeconds = sessions.reduce((total, session) => total + session.duration, 0);
  return Math.round(totalSeconds / 60);
};

// Calculate minutes meditated today
export const calculateTodayMinutes = (sessions: MeditationSession[]): number => {
  const todaySessions = sessions.filter(session => isToday(session.date));
  const totalSeconds = todaySessions.reduce((total, session) => total + session.duration, 0);
  return Math.round(totalSeconds / 60);
};

// Calculate minutes meditated this week
export const calculateWeekMinutes = (sessions: MeditationSession[]): number => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
  startOfWeek.setHours(0, 0, 0, 0);
  
  const weekSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= startOfWeek;
  });
  
  const totalSeconds = weekSessions.reduce((total, session) => total + session.duration, 0);
  return Math.round(totalSeconds / 60);
};

// Calculate current meditation streak
export const calculateStreak = (sessions: MeditationSession[]): number => {
  if (sessions.length === 0) return 0;
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if meditated today or yesterday
  const meditatedToday = sortedSessions.some(session => 
    isSameDay(new Date(session.date), today)
  );
  
  const meditatedYesterday = sortedSessions.some(session => 
    isSameDay(new Date(session.date), yesterday)
  );
  
  if (!meditatedToday && !meditatedYesterday) {
    return 0; // Streak broken
  }
  
  // Count streak days
  let streak = meditatedToday ? 1 : 0;
  let currentDate = meditatedToday ? yesterday : new Date(yesterday);
  currentDate.setDate(currentDate.getDate() - 1);
  
  while (true) {
    const meditatedOnDate = sortedSessions.some(session => 
      isSameDay(new Date(session.date), currentDate)
    );
    
    if (!meditatedOnDate) break;
    
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
};

// Calculate average session length
export const calculateAverageSessionLength = (sessions: MeditationSession[]): number => {
  if (sessions.length === 0) return 0;
  
  const totalSeconds = sessions.reduce((total, session) => total + session.duration, 0);
  return Math.round((totalSeconds / sessions.length) / 60);
};

// Calculate longest streak
export const calculateLongestStreak = (sessions: MeditationSession[]): number => {
  if (sessions.length === 0) return 0;
  
  // Implementation would require session history
  // For the MVP, we'll return the current streak
  return calculateStreak(sessions);
};

// Calculate all stats at once
export const calculateSessionStats = (sessions: MeditationSession[]): AppStats => {
  return {
    totalMinutes: calculateTotalMinutes(sessions),
    totalToday: calculateTodayMinutes(sessions),
    minutesThisWeek: calculateWeekMinutes(sessions),
    currentStreak: calculateStreak(sessions),
    longestStreak: calculateLongestStreak(sessions),
    averageSessionLength: calculateAverageSessionLength(sessions),
  };
};