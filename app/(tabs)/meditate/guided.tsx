// app/(tabs)/meditate/guided.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { MeditationTrack } from '@/types';
import { sampleMeditations } from '@/data/sampleMeditations';
import { DownloadCloud, PlayCircle, PauseCircle, SkipBack, SkipForward } from 'lucide-react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MEDITATION_TRACKS_STORAGE_KEY = '@ZenMind:MeditationTracks';

// Helper function to format milliseconds to MM:SS
const formatMillisToTime = (millis: number | undefined): string => {
  if (millis === undefined) return '00:00';
  const totalSeconds = Math.floor(millis / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Player Controls Component
interface PlayerControlsProps {
  track: MeditationTrack | null;
  playbackStatus: AVPlaybackStatus | null;
  isPlaying: boolean;
  onPlayPausePress: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
  onSeekTo: (position: number) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  track,
  playbackStatus,
  isPlaying,
  onPlayPausePress,
  onSeekBackward,
  onSeekForward,
  onSeekTo,
  colors,
}) => {
  // Create a ref for the progress bar to measure its width
  const progressBarRef = React.useRef<View>(null);
  const [progressBarWidth, setProgressBarWidth] = React.useState(0);
  
  // Measure the progress bar width when the component mounts
  React.useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.measure((_x, _y, width) => {
        if (width) setProgressBarWidth(width);
      });
    }
  }, []);
  if (!track || !playbackStatus || !playbackStatus.isLoaded) {
    return null;
  }

  const { positionMillis, durationMillis } = playbackStatus;
  const progress = durationMillis ? (positionMillis / durationMillis) * 100 : 0;

  return (
    <View style={[styles.playerControlsContainer, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.playerTrackTitle, { color: colors.textPrimary }]}>{track.title}</Text>
      
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
            onSeekTo(seekPosition);
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
        <Text style={[styles.timeText, { color: colors.textSecondary }]}>{formatMillisToTime(positionMillis)}</Text>
        <Text style={[styles.timeText, { color: colors.textSecondary }]}>{formatMillisToTime(durationMillis)}</Text>
      </View>
      
      {/* Playback controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={onSeekBackward} style={styles.controlButton}>
          <SkipBack color={colors.primary} size={28} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onPlayPausePress} style={styles.playPauseButton}>
          <View style={[styles.playPauseCircle, { backgroundColor: colors.primary }]}>
            {isPlaying ? (
              <PauseCircle color="white" size={40} />
            ) : (
              <PlayCircle color="white" size={40} />
            )}
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onSeekForward} style={styles.controlButton}>
          <SkipForward color={colors.primary} size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default function GuidedMeditationsScreen() {
  const { colors } = useTheme();
  const [meditationTracks, setMeditationTracks] = useState<MeditationTrack[]>([]);
  const [downloadingTrackId, setDownloadingTrackId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    const loadAndMergeData = async () => {
      setIsLoading(true);
      try {
        const storedTracksJson = await AsyncStorage.getItem(MEDITATION_TRACKS_STORAGE_KEY);
        const storedTracks: MeditationTrack[] = storedTracksJson ? JSON.parse(storedTracksJson) : [];
        
        const mergedTracks = sampleMeditations.map(sampleTrack => {
          const storedTrack = storedTracks.find(st => st.id === sampleTrack.id);
          return storedTrack ? { ...sampleTrack, ...storedTrack } : sampleTrack;
        });
        
        setMeditationTracks(mergedTracks);
      } catch (e) {
        console.error('Failed to load meditation tracks from storage', e);
        setMeditationTracks(sampleMeditations);
      } finally {
        setIsLoading(false);
      }
    };
    loadAndMergeData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      if (!isLoading && meditationTracks.length > 0) {
        try {
          const jsonValue = JSON.stringify(meditationTracks);
          await AsyncStorage.setItem(MEDITATION_TRACKS_STORAGE_KEY, jsonValue);
        } catch (e) {
          console.error('Failed to save meditation tracks to storage', e);
        }
      }
    };
    saveData();
  }, [meditationTracks, isLoading]);

  useEffect(() => {
    return sound
      ? () => { sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setPlaybackStatus(status);
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying); // Sync isPlaying with actual status
      if (status.didJustFinish) {
        setIsPlaying(false);
        // Consider whether to setCurrentPlayingId(null) or allow replay
        // sound?.setPositionAsync(0); // Reset position for replay
      }
    } else { // If unloaded or error
        setIsPlaying(false);
        // if (status.error) console.error(`Playback Error: ${status.error}`);
    }
  };
  
  const playPauseCurrentTrack = async () => {
    if (!sound || !currentPlayingId) return;

    const trackToPlayPause = meditationTracks.find(t => t.id === currentPlayingId);
    if (!trackToPlayPause) return;

    // Call handleItemPress to reuse its logic for playing/pausing the current track
    await handleItemPress(trackToPlayPause);
  };

  // Seek backward by 10 seconds
  const seekBackward = async () => {
    if (!sound || !playbackStatus || !playbackStatus.isLoaded) return;
    
    const newPosition = Math.max(0, playbackStatus.positionMillis - 10000);
    await sound.setPositionAsync(newPosition);
  };

  // Seek forward by 10 seconds
  const seekForward = async () => {
    if (!sound || !playbackStatus || !playbackStatus.isLoaded) return;
    
    const newPosition = Math.min(
      playbackStatus.durationMillis || 0, 
      playbackStatus.positionMillis + 10000
    );
    await sound.setPositionAsync(newPosition);
  };

  // Seek to a specific position (for progress bar interaction)
  const seekTo = async (position: number) => {
    if (!sound || !playbackStatus || !playbackStatus.isLoaded) return;
    
    // Ensure position is within valid range
    const validPosition = Math.max(0, Math.min(position, playbackStatus.durationMillis || 0));
    await sound.setPositionAsync(validPosition);
  };


  const handleItemPress = async (track: MeditationTrack) => {
    if (track.isDownloaded && track.localPath) {
      if (currentPlayingId === track.id && sound) { // Track is already loaded
          if (isPlaying) {
            await sound.pauseAsync();
          } else {
            await sound.playAsync();
          }
          // isPlaying state will be updated by onPlaybackStatusUpdate
      } else { // New track selected or different track was playing
        if (sound) { 
          await sound.unloadAsync();
        }
        const newSound = new Audio.Sound();
        try {
          newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
          await newSound.loadAsync({ uri: track.localPath }, { shouldPlay: true });
          setSound(newSound);
          setCurrentPlayingId(track.id);
          // isPlaying will be set by onPlaybackStatusUpdate
        } catch (error) {
          console.error('Error loading or playing sound:', error);
          setCurrentPlayingId(null);
          setSound(null);
        }
      }
    } else if (downloadingTrackId === track.id) {
      // Already downloading
    } else {
      setDownloadingTrackId(track.id);
      try {
        const fileExtension = track.audioUrl.split('.').pop() || 'mp3';
        const fileName = `${track.id}_${track.title.replace(/\s+/g, '_')}.${fileExtension}`;
        const localUri = `${FileSystem.documentDirectory}${fileName}`;
        const downloadResult = await FileSystem.downloadAsync(track.audioUrl, localUri);

        if (downloadResult.status === 200) {
          setMeditationTracks(prevTracks =>
            prevTracks.map(t =>
              t.id === track.id ? { ...t, isDownloaded: true, localPath: downloadResult.uri } : t
            )
          );
        } else {
          console.error('Download failed:', downloadResult.status);
        }
      } catch (error) {
        console.error('Error downloading track:', track.title, error);
      } finally {
        setDownloadingTrackId(null);
      }
    }
  };

  const renderMeditationItem = ({ item }: { item: MeditationTrack }) => (
    <TouchableOpacity 
      style={[styles.itemContainer, { backgroundColor: colors.cardBackground }]} 
      onPress={() => handleItemPress(item)}
      disabled={downloadingTrackId === item.id}
    >
      <View style={styles.itemTextContainer}>
        <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{item.title}</Text>
        {item.duration && (
          <Text style={[styles.itemDuration, { color: colors.textSecondary }]}>
            {formatMillisToTime(item.duration * 1000)}
          </Text>
        )}
        <Text style={[styles.itemStatus, { color: item.isDownloaded ? colors.success : colors.textSecondary}]}>
          {downloadingTrackId === item.id 
            ? 'Downloading...'
            : item.isDownloaded 
              ? (currentPlayingId === item.id ? (isPlaying ? 'Playing' : 'Paused') : 'Downloaded')
              : 'Tap to download'}
        </Text>
      </View>
      <View style={styles.itemIconContainer}>
        {downloadingTrackId === item.id ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : item.isDownloaded ? (
          currentPlayingId === item.id && isPlaying ? (
            <PauseCircle color={colors.primary} size={32} />
          ) : (
            <PlayCircle color={colors.primary} size={32} />
          )
        ) : (
          <DownloadCloud color={colors.primary} size={32} />
        )}
      </View>
    </TouchableOpacity>
  );
  
  const currentTrackForPlayer = meditationTracks.find(t => t.id === currentPlayingId);

  if (isLoading && meditationTracks.length === 0) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Guided Meditations</Text>
      </View>
      {meditationTracks.length === 0 && !isLoading ? (
         <View style={styles.centered}>
            <Text style={{color: colors.textSecondary}}>No meditations available.</Text>
         </View>
      ) : (
        <FlatList
          data={meditationTracks}
          renderItem={renderMeditationItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          extraData={{ downloadingTrackId, currentPlayingId, isPlaying }}
        />
      )}
      {currentTrackForPlayer && playbackStatus && playbackStatus.isLoaded && (
        <PlayerControls
          track={currentTrackForPlayer}
          playbackStatus={playbackStatus}
          isPlaying={isPlaying}
          onPlayPausePress={playPauseCurrentTrack}
          onSeekBackward={seekBackward}
          onSeekForward={seekForward}
          onSeekTo={seekTo}
          colors={colors}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1, // Ensure centered content takes full available space if list is empty
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 50 : 30,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    width: '100%',
  },
  listContentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 80, // Add padding to avoid overlap with player controls
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDuration: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemStatus: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  itemIconContainer: {
    marginLeft: 15,
  },
  // Player Controls Styles
  playerControlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16, // Safer area for iOS
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0', // Use a theme color later
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10, // For Android shadow
  },
  playerTrackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
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
    marginBottom: 16,
  },
  timeText: {
    fontSize: 12,
    minWidth: 40, // Ensure space for time
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
  playerPlayPauseButton: {
    paddingHorizontal: 10, // Keep for backward compatibility
  }
});
