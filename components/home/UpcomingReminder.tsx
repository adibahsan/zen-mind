import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Bell, X } from 'lucide-react-native';

export default function UpcomingReminder() {
  const { colors, spacing } = useTheme();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.cardBackground, 
        borderColor: colors.primary,
        marginHorizontal: spacing.md,
      }
    ]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(110, 158, 207, 0.2)' }]}>
          <Bell size={20} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Evening Meditation
          </Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            Today, 8:00 PM
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.closeButton}>
        <X size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
  },
});