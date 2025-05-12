import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface BreathingGuideProps {
  isActive: boolean;
}

export default function BreathingGuide({ isActive }: BreathingGuideProps) {
  const { colors } = useTheme();
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const textContent = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      // Create the breathing animation sequence
      const breatheIn = Animated.timing(breatheAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false,
      });
      
      const holdBreath = Animated.timing(breatheAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      });
      
      const breatheOut = Animated.timing(breatheAnim, {
        toValue: 0,
        duration: 4000,
        useNativeDriver: false,
      });
      
      const restAfter = Animated.timing(breatheAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: false,
      });
      
      // Text animation for "Breathe in"
      const textInShow = Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      });
      
      const textInHide = Animated.timing(textOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      });
      
      // Create the animation sequence and run it in a loop
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            breatheIn,
            Animated.timing(textContent, {
              toValue: 0,
              duration: 0,
              useNativeDriver: false,
            }),
            textInShow,
          ]),
          textInHide,
          Animated.parallel([
            holdBreath,
            Animated.timing(textContent, {
              toValue: 1,
              duration: 0,
              useNativeDriver: false,
            }),
            textInShow,
          ]),
          textInHide,
          Animated.parallel([
            breatheOut,
            Animated.timing(textContent, {
              toValue: 2,
              duration: 0,
              useNativeDriver: false,
            }),
            textInShow,
          ]),
          textInHide,
          Animated.parallel([
            restAfter,
            Animated.timing(textContent, {
              toValue: 3,
              duration: 0,
              useNativeDriver: false,
            }),
            textInShow,
          ]),
          textInHide,
        ])
      ).start();
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
  }, [isActive, breatheAnim, textOpacity, textContent]);

  const circleSize = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 180],
  });
  
  const textContents = ['Breathe In', 'Hold', 'Breathe Out', 'Rest'];
  // Use the animated value to get an index instead of trying to interpolate strings
  const textIndex = useRef(0);
  
  // Update the text index when textContent changes
  useEffect(() => {
    textContent.addListener(({ value }) => {
      textIndex.current = Math.round(value);
    });
    
    return () => textContent.removeAllListeners();
  }, [textContent]);

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
        {textContents[textIndex.current % textContents.length]}
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