import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MeditationSession } from '@/types';
import { getWeekDays } from '@/utils/dateHelpers';

interface WeeklyChartProps {
  sessions: MeditationSession[];
}

export default function WeeklyChart({ sessions }: WeeklyChartProps) {
  const { colors } = useTheme();
  const weekDays = getWeekDays();
  
  // Calculate minutes for each day of the week
  const dailyMinutes = calculateDailyMinutes(sessions);
  
  // Find the maximum value for scaling
  const maxMinutes = Math.max(...Object.values(dailyMinutes), 20);
  
  // Chart dimensions
  const chartWidth = Dimensions.get('window').width - 40;
  const barWidth = (chartWidth - (weekDays.length - 1) * 8) / weekDays.length;

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.chartContainer}>
        {weekDays.map((day, index) => {
          const minutes = dailyMinutes[day] || 0;
          const heightPercentage = (minutes / maxMinutes) * 100;
          const barHeight = Math.max(heightPercentage, 5); // Minimum height for visibility
          
          return (
            <View key={day} style={styles.barContainer}>
              <View 
                style={[
                  styles.barWrapper, 
                  { height: 150 }
                ]}
              >
                <View 
                  style={[
                    styles.bar, 
                    { 
                      backgroundColor: colors.primary,
                      height: `${barHeight}%`,
                      width: barWidth,
                      opacity: minutes > 0 ? 1 : 0.3,
                    }
                  ]}
                />
              </View>
              <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>
                {day}
              </Text>
              <Text style={[styles.minutesLabel, { color: colors.textPrimary }]}>
                {minutes}m
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function calculateDailyMinutes(sessions: MeditationSession[]): Record<string, number> {
  const dayMap: Record<string, number> = {};
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Initialize all days with 0
  weekDays.forEach(day => {
    dayMap[day] = 0;
  });
  
  // Group session minutes by day
  sessions.forEach(session => {
    const sessionDate = new Date(session.date);
    const dayOfWeek = weekDays[sessionDate.getDay()];
    const minutes = Math.round(session.duration / 60);
    
    // Only count sessions from the last 7 days
    const now = new Date();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
    
    if (sessionDate >= oneWeekAgo) {
      dayMap[dayOfWeek] = (dayMap[dayOfWeek] || 0) + minutes;
    }
  });
  
  return dayMap;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
  },
  barContainer: {
    alignItems: 'center',
  },
  barWrapper: {
    justifyContent: 'flex-end',
  },
  bar: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  dayLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 8,
  },
  minutesLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    marginTop: 2,
  },
});