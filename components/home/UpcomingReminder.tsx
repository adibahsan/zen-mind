import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function UpcomingReminder() {
  const { colors, spacing } = useTheme();
  
  // This can be replaced with actual reminder logic later
  const hasReminder = true; 

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.lg }]}>
      <View style={[styles.card, { backgroundColor: colors.cardBackground, borderRadius: 16 }]}>
        <Feather name="bell" size={24} color={colors.secondary} />
        <View style={styles.textContainer}>
          {hasReminder ? (
            <>
              <Text style={[styles.title, { color: colors.textPrimary }]}>Next Reminder</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Evening Wind Down at 9:00 PM
              </Text>
            </>
          ) : (
            <Text style={[styles.title, { color: colors.textPrimary }]}>No Reminders Set</Text>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.secondary, borderRadius: 12 }]}
          onPress={() => router.push('/settings')}
        >
          <Text style={[styles.buttonText, { color: colors.cardBackground }]}>
            {hasReminder ? 'Adjust' : 'Set Reminder'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 20,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});
