import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import { Pause, Play, ArrowLeft, Volume2, VolumeX } from 'lucide-react-native';
import MoodSelector from '@/components/meditation/MoodSelector';
import { secondsToMinutesAndSeconds } from '@/utils/timeHelpers';
import { getMeditationTypeById } from '@/data/meditationTypes';
import BreathingGuide from '@/components/meditation/BreathingGuide';

export default function TimerScreen() {
  const { duration, type } = useLocalSearchParams<{ duration: string; type: string }>();
  const { colors } = useTheme();
  const { addSession } = useAppData();
  
  const durationInSeconds = parseInt(duration || '10') * 60;
  const meditationType = type ? getMeditationTypeById(type) : null;
  
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [moodBefore, setMoodBefore] = useState(3);
  const [moodAfter, setMoodAfter] = useState(3);
  const [notes, setNotes] = useState('');
  const [soundOn, setSoundOn] = useState(true);
  
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // Start the timer automatically
  useEffect(() => {
    if (isRunning && !isCompleted && timeLeft > 0) {
      timerInterval.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval.current!);
            setIsCompleted(true);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [isRunning, isCompleted]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const endSession = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    
    // Save the session
    addSession({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: durationInSeconds - timeLeft,
      type: type || 'mindfulness',
      moodBefore,
      moodAfter: isCompleted ? moodAfter : moodBefore,
      notes,
    });
    
    router.back();
  };

  const { minutes, seconds } = secondsToMinutesAndSeconds(timeLeft);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={endSession} style={styles.backButton}>
          <ArrowLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSoundOn(!soundOn)} style={styles.soundButton}>
          {soundOn ? (
            <Volume2 color={colors.textPrimary} size={24} />
          ) : (
            <VolumeX color={colors.textPrimary} size={24} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {!isCompleted ? (
          <>
            <Text style={[styles.meditationType, { color: colors.textPrimary }]}>
              {meditationType?.name || 'Mindfulness Meditation'}
            </Text>
            
            <View style={styles.timerSection}>
              <BreathingGuide isActive={isRunning} />
              
              <View style={styles.timerContainer}>
                <Text style={[styles.timer, { color: colors.textPrimary }]}>
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </Text>
              </View>
              
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: colors.primary }]}
                onPress={toggleTimer}
              >
                {isRunning ? (
                  <Pause color="white" size={24} />
                ) : (
                  <Play color="white" size={24} />
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.completedContainer}>
            <Text style={[styles.completedTitle, { color: colors.textPrimary }]}>
              Great job!
            </Text>
            <Text style={[styles.completedSubtitle, { color: colors.textSecondary }]}>
              You've completed your meditation.
            </Text>
            
            <View style={styles.moodSection}>
              <Text style={[styles.moodTitle, { color: colors.textPrimary }]}>
                How do you feel now?
              </Text>
              <MoodSelector 
                selectedMood={moodAfter} 
                onSelectMood={setMoodAfter} 
              />
            </View>
            
            <TouchableOpacity
              style={[styles.finishButton, { backgroundColor: colors.primary }]}
              onPress={endSession}
            >
              <Text style={styles.finishButtonText}>Finish</Text>
            </TouchableOpacity>
          </View>
        )}
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
  },
  backButton: {
    padding: 8,
  },
  soundButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  meditationType: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 40,
  },
  timerSection: {
    alignItems: 'center',
  },
  timerContainer: {
    marginVertical: 40,
  },
  timer: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 48,
    textAlign: 'center',
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedContainer: {
    width: '100%',
    alignItems: 'center',
  },
  completedTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    marginBottom: 8,
  },
  completedSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 40,
  },
  moodSection: {
    width: '100%',
    marginBottom: 40,
  },
  moodTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  finishButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  finishButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'white',
  },
});