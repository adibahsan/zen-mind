import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MeditationSession } from '@/types';
import { formatDuration } from '@/utils/timeHelpers';
import { getMeditationTypeById } from '@/data/meditationTypes';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface RecentSessionsProps {
  sessions: MeditationSession[];
}

const SessionCard: React.FC<{ session: MeditationSession }> = ({ session }) => {
  const { colors, spacing } = useTheme();
  const meditationType = getMeditationTypeById(session.type);

  if (!meditationType) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground, borderRadius: 16 }]}>
      <Feather name={meditationType.icon as any} size={28} color={colors.primary} />
      <Text style={[styles.cardTitle, { color: colors.textPrimary, marginTop: spacing.sm }]}>
        {meditationType.name}
      </Text>
      <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
        {formatDuration(Math.round(session.duration / 60))}
      </Text>
    </View>
  );
};

export default function RecentSessions({ sessions }: RecentSessionsProps) {
  const { colors, spacing } = useTheme();

  if (sessions.length === 0) {
    return null;
  }

  return (
    <View>
      <View style={[styles.header, { paddingHorizontal: spacing.lg, marginBottom: spacing.md }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Recent Sessions</Text>
        <TouchableOpacity onPress={() => router.push('/stats')}>
          <Text style={[styles.headerButton, { color: colors.primary }]}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sessions}
        renderItem={({ item }) => <SessionCard session={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg }}
        snapToInterval={width * 0.6 + spacing.md}
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  headerButton: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  card: {
    width: width * 0.6,
    padding: 16,
    marginRight: 16,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: 150,
  },
  cardTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 20,
  },
  cardSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
});
