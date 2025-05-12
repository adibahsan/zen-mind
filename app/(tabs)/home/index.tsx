import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import { formatDate, getGreeting } from '@/utils/dateHelpers';
import DailyStreak from '@/components/home/DailyStreak';
import QuickStartButton from '@/components/home/QuickStartButton';
import TodayProgress from '@/components/home/TodayProgress';
import UpcomingReminder from '@/components/home/UpcomingReminder';
import RecentSessions from '@/components/home/RecentSessions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

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
      params: { duration, type }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { marginHorizontal: spacing.md }]}>
          <View>
            <Text style={[styles.greeting, { color: colors.textPrimary }]}>{greeting}</Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>{currentDate}</Text>
          </View>
        </View>

        <DailyStreak currentStreak={stats.currentStreak} />

        <View style={[styles.section, { marginHorizontal: spacing.md }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Start</Text>
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
            <QuickStartButton 
              title="15 Min" 
              subtitle="Focus" 
              onPress={() => startQuickMeditation(15, 'focus')}
              icon="target"
              color="#F0A19B"
            />
          </View>
        </View>

        <TodayProgress 
          totalMinutes={stats.totalToday} 
          goalMinutes={20}
        />

        <UpcomingReminder />

        <RecentSessions sessions={sessions.slice(0, 3)} />
        
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
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
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 12,
  },
  quickStartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});