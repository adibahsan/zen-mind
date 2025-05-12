import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import BreathingPattern from '@/components/meditation/BreathingPattern';
import { breathingPatterns } from '@/data/breathingPatterns';

export default function BreathingScreen() {
  const { colors, spacing } = useTheme();
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Breathing Exercises</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.patternDisplay, { backgroundColor: colors.cardBackground }]}>
          <BreathingPattern pattern={selectedPattern} isActive={true} />
          <View style={styles.patternInfo}>
            <Text style={[styles.patternName, { color: colors.textPrimary }]}>
              {selectedPattern.name}
            </Text>
            <Text style={[styles.patternDescription, { color: colors.textSecondary }]}>
              {selectedPattern.description}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginHorizontal: spacing.md }]}>
          Choose a Pattern
        </Text>
        
        <FlatList
          data={breathingPatterns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.patternList, { paddingHorizontal: spacing.md }]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.patternCard,
                { 
                  backgroundColor: colors.cardBackground,
                  borderColor: selectedPattern.id === item.id ? colors.primary : 'transparent',
                }
              ]}
              onPress={() => setSelectedPattern(item)}
            >
              <Text style={[styles.patternCardTitle, { color: colors.textPrimary }]}>
                {item.name}
              </Text>
              <Text style={[styles.patternCardRatio, { color: colors.textSecondary }]}>
                {`${item.inhale}-${item.hold1}-${item.exhale}-${item.hold2}`}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  patternDisplay: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    alignItems: 'center',
  },
  patternInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  patternName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    marginBottom: 8,
  },
  patternDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    marginBottom: 16,
  },
  patternList: {
    paddingBottom: 100,
  },
  patternCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  patternCardTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  patternCardRatio: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});