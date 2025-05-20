import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useTheme } from '@/context/ThemeContext';
import { PlayCircle, PauseCircle, X, Maximize2 } from 'lucide-react-native';
import { router, usePathname } from 'expo-router';

// Helper function to format milliseconds to MM:SS
const formatMillisToTime = (millis: number | undefined): string => {
  if (millis === undefined) return '00:00';
  const totalSeconds = Math.floor(millis / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const MinimizedPlayer: React.FC = () => {
  // Get current route to determine if we should show the minimized player
  const pathname = usePathname();
  const isOnGuidedMeditationScreen = pathname === '/meditate/guided';
  const { 
    currentTrack, 
    isPlaying, 
    playbackStatus, 
    pausePlayback, 
    resumePlayback, 
    stopPlayback,
    setIsMinimized
  } = useAudioPlayer();
  
  const { colors } = useTheme();
  
  // Don't render if no track is loaded or if we're on the guided meditation screen
  if (!currentTrack || !playbackStatus?.isLoaded || isOnGuidedMeditationScreen) {
    return null;
  }
  
  const { positionMillis, durationMillis } = playbackStatus;
  const progress = durationMillis ? (positionMillis / durationMillis) * 100 : 0;
  
  // Handle expanding the player
  const handleExpand = () => {
    setIsMinimized(false);
    router.push('/meditate/guided');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      {/* Progress bar at the top */}
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${progress}%`, backgroundColor: colors.primary }
          ]} 
        />
      </View>
      
      <View style={styles.contentContainer}>
        {/* Track info */}
        <View style={styles.trackInfoContainer}>
          <Text 
            style={[styles.title, { color: colors.textPrimary }]} 
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {currentTrack.title}
          </Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {formatMillisToTime(positionMillis)} / {formatMillisToTime(durationMillis)}
          </Text>
        </View>
        
        {/* Controls */}
        <View style={styles.controlsContainer}>
          {/* Play/Pause button */}
          <TouchableOpacity 
            onPress={isPlaying ? pausePlayback : resumePlayback}
            style={styles.iconButton}
          >
            {isPlaying ? (
              <PauseCircle color={colors.primary} size={32} />
            ) : (
              <PlayCircle color={colors.primary} size={32} />
            )}
          </TouchableOpacity>
          
          {/* Expand button */}
          <TouchableOpacity 
            onPress={handleExpand}
            style={styles.iconButton}
          >
            <Maximize2 color={colors.primary} size={24} />
          </TouchableOpacity>
          
          {/* Close button */}
          <TouchableOpacity 
            onPress={stopPlayback}
            style={styles.iconButton}
          >
            <X color={colors.error} size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60, // Above the tab bar
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  progressBarContainer: {
    height: 2,
    backgroundColor: '#e0e0e0',
  },
  progressBar: {
    height: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  trackInfoContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    marginTop: 2,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginLeft: 4,
  },
});
