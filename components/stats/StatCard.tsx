import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.container, 
      { backgroundColor: colors.cardBackground }
    ]}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={[styles.title, { color: colors.textSecondary }]}>
        {title}
      </Text>
      <Text style={[styles.value, { color: colors.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    flex: 0.48,
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
  },
});