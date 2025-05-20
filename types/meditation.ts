// types/meditation.ts
export interface MeditationTrack {
  id: string; // Unique identifier for the track
  title: string; // Display title of the meditation
  description?: string; // Optional longer description
  audioUrl: string; // URL to the audio file (for streaming/downloading)
  duration?: number; // Duration in seconds (optional, can be fetched from audio metadata later)
  isDownloaded: boolean; // True if the track is downloaded locally
  localPath?: string; // Local file path if downloaded
  // Possible future additions:
  // category?: string;
  // artist?: string;
  // coverImage?: string;
}
