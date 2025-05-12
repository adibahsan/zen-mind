import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MeditationSession } from '@/types';
import { formatDateShort } from '@/utils/dateHelpers';
import { formatDuration } from '@/utils/timeHelpers';
import { getMeditationTypeById, getMeditationTypeColor } from '@/data/meditationTypes';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

interface RecentSessionsProps {
  sessions: MeditationSession[];
}

export default function RecentSessions({ sessions }: RecentSessionsProps) {
  const { colors, spacing } = useTheme();

  if (sessions.length === 0) {
    return null;
  }

  return (
    <View style={{ marginHorizontal: spacing.md }}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Recent Sessions
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/stats')}
          style={styles.viewAllButton}
        >
          <Text style={[styles.viewAllText, { color: colors.primary }]}>
            View All
          </Text>
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {sessions.map((session) => {
        const meditationType = getMeditationTypeById(session.type);
        const sessionDuration = Math.round(session.duration / 60);
        
        return (
          <View 
            key={session.id}
            style={[
              styles.sessionCard, 
              { 
                backgroundColor: colors.cardBackground,
                borderLeftColor: getMeditationTypeColor(session.type) 
              }
            ]}
          >
            <View style={styles.sessionInfo}>
              <Text style={[styles.sessionType, { color: colors.textPrimary }]}>
                {meditationType?.name || 'Meditation'}
              </Text>
              <Text style={[styles.sessionDate, { color: colors.textSecondary }]}>
                {formatDateShort(new Date(session.date))}
              </Text>
            </View>
            <Text style={[styles.sessionDuration, { color: colors.textPrimary }]}>
              {formatDuration(sessionDuration)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginRight: 4,
  },
  sessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionType: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  sessionDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  sessionDuration: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});