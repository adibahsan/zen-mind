import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import ProgressCircle from '@/components/stats/ProgressCircle';
import StatCard from '@/components/stats/StatCard';
import { Clock, Calendar, Flame, TrendingUp } from 'lucide-react-native';
import WeeklyChart from '@/components/stats/WeeklyChart';
import MeditationTypeDistribution from '@/components/stats/MeditationTypeDistribution';
import { calculateTotalMinutes } from '@/utils/statsHelpers';
import EmptyState from '@/components/common/EmptyState';

export default function StatsScreen() {
  const { colors, spacing } = useTheme();
  const { sessions, stats } = useAppData();
  
  if (sessions.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <Text style={[styles.title, { color: colors.textPrimary, marginHorizontal: spacing.md, marginTop: 16 }]}>
          Statistics
        </Text>
        <EmptyState
          icon={<TrendingUp color={colors.textSecondary} size={48} />}
          title="No meditation data yet"
          description="Complete your first meditation session to see your statistics."
          actionLabel="Start Meditating"
          onAction={() => router.push('/meditate')}
        />
      </SafeAreaView>
    );
  }

  const totalMinutes = calculateTotalMinutes(sessions);
  const dailyGoal = 20; // Minutes per day
  
  const progressPercentage = Math.min(
    Math.floor((totalMinutes / 500) * 100), // Progress toward 500 minutes
    100
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { marginHorizontal: spacing.md }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Statistics</Text>
        </View>

        <View style={[styles.progressSection, { backgroundColor: colors.cardBackground, marginHorizontal: spacing.md }]}>
          <ProgressCircle percentage={progressPercentage} />
          <View style={styles.progressInfo}>
            <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>
              Total Meditation
            </Text>
            <Text style={[styles.progressValue, { color: colors.primary }]}>
              {totalMinutes} mins
            </Text>
            <Text style={[styles.progressGoal, { color: colors.textSecondary }]}>
              Goal: 500 mins
            </Text>
          </View>
        </View>

        <View style={styles.statsGridContainer}>
          <View style={styles.statsRow}>
            <StatCard 
              title="Current Streak" 
              value={`${stats.currentStreak} days`}
              icon={<Flame color={colors.primary} size={20} />}
            />
            <StatCard 
              title="This Week" 
              value={`${stats.minutesThisWeek} mins`}
              icon={<Calendar color={colors.primary} size={20} />}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard 
              title="Sessions" 
              value={`${sessions.length}`}
              icon={<TrendingUp color={colors.primary} size={20} />}
            />
            <StatCard 
              title="Avg. Session" 
              value={`${Math.round(stats.averageSessionLength)} mins`}
              icon={<Clock color={colors.primary} size={20} />}
            />
          </View>
        </View>

        <View style={[styles.chartSection, { marginHorizontal: spacing.md }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Weekly Progress
          </Text>
          <WeeklyChart sessions={sessions} />
        </View>

        <View style={[styles.chartSection, { marginHorizontal: spacing.md }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Meditation Types
          </Text>
          <MeditationTypeDistribution sessions={sessions} />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
  },
  progressSection: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  progressInfo: {
    marginLeft: 20,
    flex: 1,
  },
  progressTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  progressValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    marginBottom: 4,
  },
  progressGoal: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  statsGridContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
});