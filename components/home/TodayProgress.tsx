import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { formatDuration } from '@/utils/timeHelpers';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TodayProgressProps {
  totalMinutes: number;
  goalMinutes: number;
}

export default function TodayProgress({ totalMinutes, goalMinutes }: TodayProgressProps) {
  const { colors, spacing } = useTheme();

  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const progress = useSharedValue(0);
  const progressPercentage = Math.min((totalMinutes / goalMinutes) * 100, 100);

  React.useEffect(() => {
    progress.value = withTiming(progressPercentage / 100, { duration: 800 });
  }, [progressPercentage]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground, marginHorizontal: spacing.lg, borderRadius: 16 }]}>
      <Text style={[styles.title, { color: colors.textPrimary, marginBottom: spacing.md }]}>
        Today's Progress
      </Text>
      
      <View style={styles.content}>
        <View style={styles.chartContainer}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Defs>
              <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={colors.primary} />
                <Stop offset="100%" stopColor={colors.secondary} />
              </LinearGradient>
            </Defs>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.border}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <AnimatedCircle
              animatedProps={animatedProps}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#progressGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              fill="none"
            />
          </Svg>
          <View style={styles.progressTextContainer}>
            <Text style={[styles.percentage, { color: colors.primary }]}>{`${Math.round(progressPercentage)}%`}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Time Meditated</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{formatDuration(totalMinutes)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Daily Goal</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{formatDuration(goalMinutes)}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary, borderRadius: 12 }]}
        onPress={() => router.push('/stats')}
      >
        <Feather name="bar-chart-2" size={20} color={colors.cardBackground} />
        <Text style={[styles.buttonText, { color: colors.cardBackground, marginLeft: spacing.xs }]}>
          View Full Stats
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTextContainer: {
    position: 'absolute',
  },
  percentage: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
  },
  statsContainer: {
    flex: 1,
    marginLeft: 24,
  },
  statItem: {
    marginBottom: 12,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  statValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 8,
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});
