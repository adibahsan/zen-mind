import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { BreathingPattern as BreathingPatternType } from '@/types';

interface BreathingPatternProps {
  pattern: BreathingPatternType;
  isActive: boolean;
}

export default function BreathingPattern({ pattern, isActive }: BreathingPatternProps) {
  const { colors } = useTheme();
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const textContent = useRef(new Animated.Value(0)).current;
  const textCountdown = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      const { inhale, hold1, exhale, hold2 } = pattern;
      
      // Create the breathing animation sequence
      const breatheIn = Animated.timing(breatheAnim, {
        toValue: 1,
        duration: inhale * 1000,
        useNativeDriver: false,
      });
      
      const holdBreath1 = Animated.timing(breatheAnim, {
        toValue: 1,
        duration: hold1 * 1000,
        useNativeDriver: false,
      });
      
      const breatheOut = Animated.timing(breatheAnim, {
        toValue: 0,
        duration: exhale * 1000,
        useNativeDriver: false,
      });
      
      const holdBreath2 = Animated.timing(breatheAnim, {
        toValue: 0,
        duration: hold2 * 1000,
        useNativeDriver: false,
      });
      
      // Text animation
      const textInShow = Animated.timing(textOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      });
      
      const textInHide = Animated.timing(textOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      });
      
      // Build the sequence based on the pattern
      const sequence = [];
      
      // Inhale phase
      sequence.push(
        Animated.parallel([
          breatheIn,
          Animated.timing(textContent, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
          textInShow,
        ])
      );
      
      if (inhale > 0) {
        sequence.push(textInHide);
      }
      
      // Hold phase 1
      if (hold1 > 0) {
        sequence.push(
          Animated.parallel([
            holdBreath1,
            Animated.timing(textContent, {
              toValue: 1,
              duration: 0,
              useNativeDriver: false,
            }),
            textInShow,
          ])
        );
        sequence.push(textInHide);
      }
      
      // Exhale phase
      if (exhale > 0) {
        sequence.push(
          Animated.parallel([
            breatheOut,
            Animated.timing(textContent, {
              toValue: 2,
              duration: 0,
              useNativeDriver: false,
            }),
            textInShow,
          ])
        );
        sequence.push(textInHide);
      }
      
      // Hold phase 2
      if (hold2 > 0) {
        sequence.push(
          Animated.parallel([
            holdBreath2,
            Animated.timing(textContent, {
              toValue: 3,
              duration: 0,
              useNativeDriver: false,
            }),
            textInShow,
          ])
        );
        sequence.push(textInHide);
      }
      
      // Create the animation sequence and run it in a loop
      Animated.loop(Animated.sequence(sequence)).start();
    } else {
      // Stop animation
      breatheAnim.stopAnimation();
      textOpacity.stopAnimation();
      textContent.stopAnimation();
    }
    
    return () => {
      breatheAnim.stopAnimation();
      textOpacity.stopAnimation();
      textContent.stopAnimation();
    };
  }, [isActive, pattern, breatheAnim, textOpacity, textContent]);

  const circleSize = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 180],
  });
  
  const textContents = ['Inhale', 'Hold', 'Exhale', 'Hold'];
  
  const currentText = textContent.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: textContents,
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: colors.primary,
            width: circleSize,
            height: circleSize,
            borderRadius: Animated.divide(circleSize, new Animated.Value(2)),
          },
        ]}
      />
      <Animated.Text
        style={[
          styles.breatheText,
          {
            color: colors.textPrimary,
            opacity: textOpacity,
          },
        ]}
      >
        {currentText}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  circle: {
    opacity: 0.2,
    position: 'absolute',
  },
  breatheText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    position: 'absolute',
  },
});