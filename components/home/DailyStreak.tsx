import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Flame } from 'lucide-react-native';

interface DailyStreakProps {
  currentStreak: number;
}

export default function DailyStreak({ currentStreak }: DailyStreakProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.cardBackground,
        marginHorizontal: spacing.md 
      }
    ]}>
      <View style={styles.content}>
        <View style={[styles.flameContainer, { backgroundColor: 'rgba(242, 153, 74, 0.2)' }]}>
          <Flame size={24} color="#F2994A" />
        </View>
        <View>
          <Text style={[styles.streakText, { color: colors.textSecondary }]}>
            Current Streak
          </Text>
          <View style={styles.streakValueContainer}>
            <Text style={[styles.streakValue, { color: colors.textPrimary }]}>
              {currentStreak}
            </Text>
            <Text style={[styles.streakDays, { color: colors.textPrimary }]}>
              days
            </Text>
          </View>
        </View>
      </View>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {currentStreak > 0 
          ? "Keep going! Don't break the chain." 
          : "Start your meditation streak today!"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  flameContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  streakText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 4,
  },
  streakValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    marginRight: 4,
  },
  streakDays: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});