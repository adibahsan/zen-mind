import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface JournalEntryCardProps {
  title: string;
  date: string;
  preview: string;
  onPress: () => void;
}

export default function JournalEntryCard({ 
  title, 
  date, 
  preview, 
  onPress 
}: JournalEntryCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.cardBackground }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {date}
        </Text>
      </View>
      <Text style={[styles.preview, { color: colors.textSecondary }]} numberOfLines={2}>
        {preview}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    flex: 1,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 8,
  },
  preview: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
});