// /Volumes/Kingston FURY Renegade/Github/ReactNative/zen-mind/data/sampleMeditations.ts
import { MeditationTrack } from '@/types'; // Assuming path alias for types

export const sampleMeditations: MeditationTrack[] = [
  {
    id: '1',
    title: 'A Successful & Beautiful Day',
    description: 'Start your day with positivity and focus. This meditation helps set a calm and productive tone for the day ahead.',
    audioUrl: 'https://files.quantummethod.org.bd/download?filename=/audio/publication/med_ajker_din_ti_hok_sofol_o_sundar_20250209.mp3',
    duration: 1200, // Example duration: 20 minutes (in seconds)
    isDownloaded: false,
  },
  {
    id: '2',
    title: 'Evening Relaxation',
    description: 'Unwind and release the tensions of the day. A guided session to promote restful sleep.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder URL
    duration: 900, // Example duration: 15 minutes
    isDownloaded: false,
  },
  {
    id: '3',
    title: 'Mindful Breathing',
    description: 'A short practice to center yourself by focusing on your breath.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Placeholder URL
    duration: 300, // Example duration: 5 minutes
    isDownloaded: true, // Example: already downloaded
    localPath: '/fake/path/to/mindful_breathing.mp3' // Example fake path
  },
];
