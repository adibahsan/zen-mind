import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MeditationSession } from '@/types';
import { getMeditationTypeById } from '@/data/meditationTypes';

interface MeditationTypeDistributionProps {
  sessions: MeditationSession[];
}

export default function MeditationTypeDistribution({ sessions }: MeditationTypeDistributionProps) {
  const { colors } = useTheme();
  
  // Calculate the distribution of meditation types
  const distribution = calculateDistribution(sessions);
  
  // Sort by minutes (descending)
  const sortedTypes = Object.entries(distribution.typeMinutes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5); // Show top 5
  
  const totalMinutes = distribution.totalMinutes;

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      {sortedTypes.map(([typeId, minutes]) => {
        const percentage = Math.round((minutes / totalMinutes) * 100) || 0;
        const meditationType = getMeditationTypeById(typeId);
        
        return (
          <View key={typeId} style={styles.typeRow}>
            <View style={styles.typeInfo}>
              <Text style={[styles.typeName, { color: colors.textPrimary }]}>
                {meditationType?.name || 'Unknown'}
              </Text>
              <Text style={[styles.typeMinutes, { color: colors.textSecondary }]}>
                {minutes} mins
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.disabledButton }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: meditationType?.color || colors.primary,
                    width: `${percentage}%` 
                  }
                ]}
              />
            </View>
            <Text style={[styles.percentage, { color: colors.textSecondary }]}>
              {percentage}%
            </Text>
          </View>
        );
      })}
      
      {sortedTypes.length === 0 && (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No meditation data available
        </Text>
      )}
    </View>
  );
}

function calculateDistribution(sessions: MeditationSession[]): { 
  typeMinutes: Record<string, number>; 
  totalMinutes: number;
} {
  const typeMinutes: Record<string, number> = {};
  let totalMinutes = 0;
  
  sessions.forEach(session => {
    const minutes = Math.round(session.duration / 60);
    typeMinutes[session.type] = (typeMinutes[session.type] || 0) + minutes;
    totalMinutes += minutes;
  });
  
  return { typeMinutes, totalMinutes };
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
  },
  typeRow: {
    marginBottom: 16,
  },
  typeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  typeMinutes: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  percentage: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'right',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
});