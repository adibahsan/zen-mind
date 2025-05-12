import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import {
  Bell,
  Moon,
  Volume2,
  Clock,
  Info,
  ThumbsUp,
  Trash2,
  ChevronRight
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { colors, spacing, toggleTheme, isDark } = useTheme();
  const { resetAllData } = useAppData();
  
  const [dailyReminder, setDailyReminder] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(isDark);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const handleDarkModeToggle = (value: boolean) => {
    setDarkModeEnabled(value);
    toggleTheme();
  };
  
  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all your meditation data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetAllData,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { marginHorizontal: spacing.md }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>
        </View>

        <View style={[styles.section, { marginHorizontal: spacing.md }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Notifications</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <Bell color={colors.textSecondary} size={20} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Daily Reminder</Text>
            </View>
            <Switch
              value={dailyReminder}
              onValueChange={setDailyReminder}
              trackColor={{ false: colors.disabledButton, true: colors.primary }}
              thumbColor="white"
            />
          </View>
          
          {dailyReminder && (
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomColor: colors.border }]}
              onPress={() => Alert.alert('Set Reminder Time', 'This feature would open a time picker.')}
            >
              <View style={styles.settingLeft}>
                <Clock color={colors.textSecondary} size={20} />
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>Reminder Time</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>8:00 AM</Text>
                <ChevronRight color={colors.textSecondary} size={16} />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.section, { marginHorizontal: spacing.md }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Appearance</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <Moon color={colors.textSecondary} size={20} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: colors.disabledButton, true: colors.primary }}
              thumbColor="white"
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <Volume2 color={colors.textSecondary} size={20} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Sound Effects</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: colors.disabledButton, true: colors.primary }}
              thumbColor="white"
            />
          </View>
        </View>

        <View style={[styles.section, { marginHorizontal: spacing.md }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>About</Text>
          
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <Info color={colors.textSecondary} size={20} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>About Zen Mind</Text>
            </View>
            <ChevronRight color={colors.textSecondary} size={16} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <ThumbsUp color={colors.textSecondary} size={20} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Rate the App</Text>
            </View>
            <ChevronRight color={colors.textSecondary} size={16} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { marginHorizontal: spacing.md }]}>
          <TouchableOpacity 
            style={[styles.dangerButton, { backgroundColor: colors.error }]}
            onPress={handleResetData}
          >
            <Trash2 color="white" size={20} />
            <Text style={styles.dangerButtonText}>Reset All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginRight: 8,
  },
  dangerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  dangerButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
});