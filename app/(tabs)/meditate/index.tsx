import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import MeditationTypeCard from '@/components/meditation/MeditationTypeCard';
import DurationPicker from '@/components/meditation/DurationPicker';
import { Plus, ChevronRight } from 'lucide-react-native';
import { MeditationType } from '@/types';
import { meditationTypes } from '@/data/meditationTypes';

export default function MeditateScreen() {
  const { colors, spacing } = useTheme();
  const [selectedType, setSelectedType] = useState<MeditationType | null>(null);
  const [duration, setDuration] = useState(10);

  const handleStartMeditation = () => {
    if (selectedType) {
      router.push({
        pathname: '/meditate/timer',
        params: { 
          duration: duration, 
          type: selectedType.id
        }
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { marginHorizontal: spacing.md }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Meditate</Text>
        </View>

        <View style={[styles.section, { marginHorizontal: spacing.md }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Choose a meditation
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeContainer}
          >
            {meditationTypes.map((type) => (
              <MeditationTypeCard 
                key={type.id}
                type={type}
                isSelected={selectedType?.id === type.id}
                onSelect={() => setSelectedType(type)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={[styles.section, { marginHorizontal: spacing.md }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Duration (minutes)
          </Text>
          <DurationPicker 
            value={duration} 
            onChange={setDuration} 
            min={1} 
            max={60}
          />
        </View>

        <View style={[styles.section, { marginHorizontal: spacing.md }]}>
          {/* <TouchableOpacity 
            style={[styles.breathingExerciseCard, { backgroundColor: colors.cardBackground }]}
            onPress={() => router.push('/meditate/breathing')}
          >
            <View style={styles.breathingExerciseContent}>
              <Text style={[styles.breathingExerciseTitle, { color: colors.textPrimary }]}>
                Guided Breathing
              </Text>
              <Text style={[styles.breathingExerciseSubtitle, { color: colors.textSecondary }]}>
                Calm your mind with guided patterns
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity> */}
          
          {/* Guided Meditations Card */}
          <TouchableOpacity 
            style={[styles.breathingExerciseCard, { backgroundColor: colors.cardBackground, marginTop: 12 }]}
            onPress={() => router.push('/meditate/guided')}
          >
            <View style={styles.breathingExerciseContent}>
              <Text style={[styles.breathingExerciseTitle, { color: colors.textPrimary }]}>
                Guided Meditations
              </Text>
              <Text style={[styles.breathingExerciseSubtitle, { color: colors.textSecondary }]}>
                Listen to calming guided meditations
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.startButton,
            { 
              backgroundColor: selectedType ? colors.primary : colors.disabledButton,
              marginHorizontal: spacing.md
            }
          ]}
          onPress={handleStartMeditation}
          disabled={!selectedType}
        >
          <Text style={styles.startButtonText}>Start Meditation</Text>
        </TouchableOpacity>

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
    fontSize: 18,
    marginBottom: 16,
  },
  typeContainer: {
    paddingRight: 16,
  },
  breathingExerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  breathingExerciseContent: {
    flex: 1,
  },
  breathingExerciseTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  breathingExerciseSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  startButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  startButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'white',
  },
});