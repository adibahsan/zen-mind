import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import { formatDate, getGreeting } from '@/utils/dateHelpers';
import QuickStartButton from '@/components/home/QuickStartButton';
import TodayProgress from '@/components/home/TodayProgress';
import RecentSessions from '@/components/home/RecentSessions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import DailyStreak from '@/components/home/DailyStreak';
import UpcomingReminder from '@/components/home/UpcomingReminder';

export default function HomeScreen() {
  const { colors, spacing } = useTheme();
  const { sessions, stats } = useAppData();
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setGreeting(getGreeting());
    setCurrentDate(formatDate(new Date()));
  }, []);

  const startQuickMeditation = (duration: number, type: string) => {
    router.push({
      pathname: '/meditate/timer',
      params: { duration, type },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
          <Text style={[styles.greeting, { color: colors.textPrimary }]}>{greeting}</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{currentDate}</Text>
        </View>

        {/* Daily Streak */}
        <DailyStreak currentStreak={stats.currentStreak} />

        {/* Quick Start Section */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: spacing.md }]}>
            Quick Start
          </Text>
          <View style={styles.quickStartContainer}>
            <QuickStartButton
              title="5 Min"
              subtitle="Mindfulness"
              onPress={() => startQuickMeditation(5, 'mindfulness')}
              icon="sun"
              color="#6E9ECF"
            />
            <QuickStartButton
              title="10 Min"
              subtitle="Breathing"
              onPress={() => startQuickMeditation(10, 'breathing')}
              icon="wind"
              color="#A192C8"
            />
          </View>
        </View>
        
        {/* Today's Progress Section */}
        <View style={{ marginTop: spacing.xl }}>
          <TodayProgress 
            totalMinutes={stats.totalToday} 
            goalMinutes={20}
          />
        </View>
        
        {/* Upcoming Reminder Section */}
        <View style={{ marginTop: spacing.xl }}>
          <UpcomingReminder />
        </View>

        {/* Recent Sessions Section */}
        <View style={{ marginTop: spacing.xl }}>
          <RecentSessions sessions={sessions.slice(0, 3)} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'center',
  },
  greeting: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  quickStartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});
