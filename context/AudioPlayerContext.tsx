import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { MeditationTrack } from '@/types';

interface AudioPlayerContextType {
  // Current playback state
  currentTrack: MeditationTrack | null;
  isPlaying: boolean;
  sound: Audio.Sound | null;
  playbackStatus: AVPlaybackStatus | null;
  
  // Control functions
  loadAndPlayTrack: (track: MeditationTrack) => Promise<void>;
  pausePlayback: () => Promise<void>;
  resumePlayback: () => Promise<void>;
  stopPlayback: () => Promise<void>;
  seekBackward: () => Promise<void>;
  seekForward: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  
  // UI state
  isMinimized: boolean;
  setIsMinimized: (value: boolean) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [currentTrack, setCurrentTrack] = useState<MeditationTrack | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Configure audio mode on mount
  useEffect(() => {
    const setupAudio = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    };
    
    setupAudio();
  }, []);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Playback status update handler
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setPlaybackStatus(status);
    
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(false);
    }
  };

  // Load and play a track
  const loadAndPlayTrack = async (track: MeditationTrack) => {
    try {
      // Make sure we have a valid local path
      if (!track.isDownloaded || !track.localPath) {
        console.error('Track is not downloaded or missing local path');
        return;
      }
      
      // Unload any existing sound
      if (sound) {
        await sound.unloadAsync();
      }
      
      // Create and load new sound
      const newSound = new Audio.Sound();
      newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      
      await newSound.loadAsync({ uri: track.localPath }, { shouldPlay: true });
      
      // Update state
      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);
      setIsMinimized(false);
    } catch (error) {
      console.error('Error loading or playing sound:', error);
    }
  };

  // Pause playback
  const pausePlayback = async () => {
    if (sound && playbackStatus?.isLoaded && isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  // Resume playback
  const resumePlayback = async () => {
    if (sound && playbackStatus?.isLoaded && !isPlaying) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  // Stop playback completely
  const stopPlayback = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setCurrentTrack(null);
      setIsPlaying(false);
      setPlaybackStatus(null);
    }
  };

  // Seek backward by 10 seconds
  const seekBackward = async () => {
    if (!sound || !playbackStatus?.isLoaded) return;
    
    const newPosition = Math.max(0, playbackStatus.positionMillis - 10000);
    await sound.setPositionAsync(newPosition);
  };

  // Seek forward by 10 seconds
  const seekForward = async () => {
    if (!sound || !playbackStatus?.isLoaded) return;
    
    const newPosition = Math.min(
      playbackStatus.durationMillis || 0, 
      playbackStatus.positionMillis + 10000
    );
    await sound.setPositionAsync(newPosition);
  };

  // Seek to a specific position
  const seekTo = async (position: number) => {
    if (!sound || !playbackStatus?.isLoaded) return;
    
    const validPosition = Math.max(0, Math.min(position, playbackStatus.durationMillis || 0));
    await sound.setPositionAsync(validPosition);
  };

  const value = {
    currentTrack,
    isPlaying,
    sound,
    playbackStatus,
    loadAndPlayTrack,
    pausePlayback,
    resumePlayback,
    stopPlayback,
    seekBackward,
    seekForward,
    seekTo,
    isMinimized,
    setIsMinimized
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
