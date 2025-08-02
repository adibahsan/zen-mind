import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';

interface DailyStreakProps {
  currentStreak: number;
}

export default function DailyStreak({ currentStreak }: DailyStreakProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { marginHorizontal: spacing.lg, borderRadius: 16, backgroundColor: colors.cardBackground }]}>
      <View style={[styles.gradient, { backgroundColor: colors.primary, borderRadius: 16 }]}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Feather name="zap" size={24} color={colors.cardBackground} />
          </View>
          <View>
            <Text style={[styles.streakText, { color: colors.cardBackground }]}>
              {currentStreak} Day Streak
            </Text>
            <Text style={[styles.streakMessage, { color: colors.cardBackground }]}>
              {currentStreak > 0 ? "Keep the flame alive!" : "Begin your journey today."}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  gradient: {
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  streakText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
  },
  streakMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    opacity: 0.8,
  },
});
