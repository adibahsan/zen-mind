// app/(tabs)/meditate/guided.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, DownloadCloud, PlayCircle, PauseCircle, SkipBack, SkipForward } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Audio } from 'expo-av';
import { sampleMeditations } from '@/data/sampleMeditations';
import { MeditationTrack } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { FullScreenPlayer } from '@/components/player/FullScreenPlayer';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

// Storage key for meditation tracks
const MEDITATION_TRACKS_STORAGE_KEY = '@ZenMind:MeditationTracks';

// Helper function to format milliseconds to MM:SS
const formatMillisToTime = (millis: number | undefined): string => {
  if (millis === undefined) return '00:00';
  const totalSeconds = Math.floor(millis / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Note: We've moved the PlayerControls component to FullScreenPlayer.tsx


export default function GuidedMeditationsScreen() {
  const { colors } = useTheme();
  const [meditationTracks, setMeditationTracks] = useState<MeditationTrack[]>([]);
  const [downloadingTrackId, setDownloadingTrackId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Use the global audio player context
  const { 
    currentTrack, 
    isPlaying, 
    playbackStatus,
    loadAndPlayTrack,
    isMinimized
  } = useAudioPlayer();

  // Function to load and merge meditation data
  const loadAndMergeData = async () => {
    setIsLoading(true);
    try {
      const storedTracksJson = await AsyncStorage.getItem(MEDITATION_TRACKS_STORAGE_KEY);
      const storedTracks: MeditationTrack[] = storedTracksJson ? JSON.parse(storedTracksJson) : [];
      
      // Use the latest sample meditations as the base
      const mergedTracks = sampleMeditations.map(sampleTrack => {
        const storedTrack = storedTracks.find(st => st.id === sampleTrack.id);
        return storedTrack ? { ...sampleTrack, ...storedTrack } : sampleTrack;
      });
      
      setMeditationTracks(mergedTracks);
    } catch (error) {
      console.error('Error loading meditation tracks:', error);
      setMeditationTracks(sampleMeditations);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear local storage for meditation tracks
  const clearMeditationTracksStorage = async () => {
    try {
      await AsyncStorage.removeItem(MEDITATION_TRACKS_STORAGE_KEY);
      Alert.alert('Success', 'Meditation tracks storage has been cleared. Reloading data...');
      loadAndMergeData(); // Reload data after clearing storage
    } catch (error) {
      console.error('Error clearing meditation tracks storage:', error);
      Alert.alert('Error', 'Failed to clear storage');
    }
  };
  
  useEffect(() => {
    // Audio mode is now set in the AudioPlayerContext
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

  // These functions are now handled by the AudioPlayerContext


  const handleItemPress = async (track: MeditationTrack) => {
    if (track.isDownloaded && track.localPath) {
      // Use the global audio player to load and play the track
      await loadAndPlayTrack(track);
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
          const updatedTrack = { ...track, isDownloaded: true, localPath: downloadResult.uri };
          setMeditationTracks(prevTracks =>
            prevTracks.map(t =>
              t.id === track.id ? updatedTrack : t
            )
          );
          
          // Automatically play the track after downloading
          await loadAndPlayTrack(updatedTrack);
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
              ? (currentTrack?.id === item.id ? (isPlaying ? 'Playing' : 'Paused') : 'Downloaded')
              : 'Tap to download'}
        </Text>
      </View>
      <View style={styles.itemIconContainer}>
        {downloadingTrackId === item.id ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : item.isDownloaded ? (
          currentTrack?.id === item.id && isPlaying ? (
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
  
  // We now use currentTrack from the AudioPlayerContext

  if (isLoading && meditationTracks.length === 0) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Only show the list view when not in full-screen player mode */}
      {isMinimized || !currentTrack ? (
        <>
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <ChevronLeft color={colors.textPrimary} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Guided Meditations</Text>
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={clearMeditationTracksStorage}
            >
              <Text style={[styles.resetButtonText, { color: colors.primary }]}>Reset</Text>
            </TouchableOpacity>
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
              extraData={{ downloadingTrackId, currentTrack, isPlaying }}
            />
          )}
        </>
      ) : null}
      
      {/* Show the full screen player if we have a current track and we're not minimized */}
      {currentTrack && !isMinimized && <FullScreenPlayer />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resetButton: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
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
  // Player controls styles have been moved to the FullScreenPlayer component
});
