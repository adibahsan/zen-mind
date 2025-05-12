import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { formatDuration } from '@/utils/timeHelpers';

interface TodayProgressProps {
  totalMinutes: number;
  goalMinutes: number;
}

export default function TodayProgress({ totalMinutes, goalMinutes }: TodayProgressProps) {
  const { colors, spacing } = useTheme();
  
  const progressPercentage = Math.min(Math.round((totalMinutes / goalMinutes) * 100), 100);
  const progressWidth = `${progressPercentage}%`;

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.cardBackground, 
        marginHorizontal: spacing.md 
      }
    ]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Today's Progress</Text>
        <Text style={[styles.duration, { color: colors.primary }]}>
          {formatDuration(totalMinutes)}
        </Text>
      </View>
      
      <View style={[styles.progressBarContainer, { backgroundColor: colors.disabledButton }]}>
        <View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: colors.primary, 
              width: progressWidth 
            }
          ]}
        />
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={[styles.statsText, { color: colors.textSecondary }]}>
          {progressPercentage}% of daily goal
        </Text>
        <Text style={[styles.statsGoal, { color: colors.textSecondary }]}>
          Goal: {formatDuration(goalMinutes)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  duration: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  statsGoal: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});