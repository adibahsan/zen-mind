import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useTheme } from '@/context/ThemeContext';
import { PlayCircle, PauseCircle, SkipBack, SkipForward, X, ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

// Helper function to format milliseconds to MM:SS
const formatMillisToTime = (millis: number | undefined): string => {
  if (millis === undefined) return '00:00';
  const totalSeconds = Math.floor(millis / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const FullScreenPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    playbackStatus, 
    pausePlayback, 
    resumePlayback, 
    stopPlayback,
    seekBackward,
    seekForward,
    seekTo,
    setIsMinimized
  } = useAudioPlayer();
  
  const { colors } = useTheme();
  
  // Create a ref for the progress bar to measure its width
  const progressBarRef = React.useRef<View>(null);
  const [progressBarWidth, setProgressBarWidth] = React.useState(0);
  
  // Don't render if no track is loaded
  if (!currentTrack || !playbackStatus?.isLoaded) {
    return null;
  }
  
  const { positionMillis, durationMillis } = playbackStatus;
  const progress = durationMillis ? (positionMillis / durationMillis) * 100 : 0;
  
  // Handle minimizing the player
  const handleMinimize = () => {
    setIsMinimized(true);
    router.back();
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMinimize} style={styles.headerButton}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={stopPlayback} style={styles.headerButton}>
          <X color={colors.error} size={24} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{currentTrack.title}</Text>
        
        {/* Interactive progress bar */}
        <View 
          ref={progressBarRef}
          style={styles.progressBarContainer}
          onLayout={(event) => {
            // Update progress bar width when layout changes
            const { width } = event.nativeEvent.layout;
            setProgressBarWidth(width);
          }}
        >
          <TouchableOpacity 
            style={styles.progressBarTouchable}
            activeOpacity={0.7}
            onPress={(event) => {
              if (!playbackStatus.isLoaded || !durationMillis || !progressBarWidth) return;
              
              // Calculate the seek position based on touch position
              const { locationX } = event.nativeEvent;
              const seekPosition = (locationX / progressBarWidth) * durationMillis;
              seekTo(seekPosition);
            }}
          >
            <View style={styles.progressBarBackground} />
            <View 
              style={[
                styles.progressBar, 
                { width: `${progress}%`, backgroundColor: colors.primary }
              ]} 
            />
            <View 
              style={[
                styles.progressThumb, 
                { 
                  left: `${progress}%`, 
                  backgroundColor: colors.primary,
                  transform: [{ translateX: -6 }] // Half the width of the thumb
                }
              ]} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Time indicators */}
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {formatMillisToTime(positionMillis)}
          </Text>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {formatMillisToTime(durationMillis)}
          </Text>
        </View>
        
        {/* Playback controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={seekBackward} style={styles.controlButton}>
            <SkipBack color={colors.primary} size={28} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={isPlaying ? pausePlayback : resumePlayback} 
            style={styles.playPauseButton}
          >
            <View style={[styles.playPauseCircle, { backgroundColor: colors.primary }]}>
              {isPlaying ? (
                <PauseCircle color="white" size={40} />
              ) : (
                <PlayCircle color="white" size={40} />
              )}
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={seekForward} style={styles.controlButton}>
            <SkipForward color={colors.primary} size={28} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 60,
  },
  progressBarContainer: {
    height: 20, // Increased height for better touch target
    justifyContent: 'center',
    marginBottom: 8,
    paddingHorizontal: 2, // Space for the thumb at edges
  },
  progressBarTouchable: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 20,
  },
  progressBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#e0e0e0', // Use a theme color for track background
    borderRadius: 3,
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    height: 6,
    borderRadius: 3,
  },
  progressThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 60,
  },
  timeText: {
    fontSize: 14,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    padding: 12,
  },
  playPauseButton: {
    marginHorizontal: 24,
  },
  playPauseCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
