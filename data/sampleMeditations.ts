// /Volumes/Kingston FURY Renegade/Github/ReactNative/zen-mind/data/sampleMeditations.ts
import { MeditationTrack } from '@/types'; // Assuming path alias for types

export const sampleMeditations: MeditationTrack[] = [
  {
    id: '1',
    title: 'একটি সফল এবং সুন্দর দিন',
    description: 'Start your day with positivity and focus. This meditation helps set a calm and productive tone for the day ahead.',
    audioUrl: 'https://files.quantummethod.org.bd/download?filename=/audio/publication/med_ajker_din_ti_hok_sofol_o_sundar_20250209.mp3',
    duration: 1200, // 20 minutes (in seconds)
    isDownloaded: false,
  },
  {
    id: '2',
    title: 'Laugh Openly, Live Joyfully',
    description: 'A meditation to help you embrace joy and laughter in your daily life.',
    audioUrl: 'https://files.quantummethod.org.bd/download?filename=/audio/publication/med_pran_khule_hasun_anonde_bachun_20250512.mp3',
    duration: 1080, // 18 minutes
    isDownloaded: false,
  },
  {
    id: '3',
    title: 'Deep Relaxation',
    description: 'A longer session for complete relaxation and release of tension.',
    audioUrl: 'https://files.quantummethod.org.bd/media/audio/publication/med_shithilaion_long_20140413.mp3',
    duration: 1500, // 25 minutes
    isDownloaded: false,
  },
  {
    id: '4',
    title: 'Evening Relaxation',
    description: 'Unwind and release the tensions of the day. A guided session to promote restful sleep.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 900, // 15 minutes
    isDownloaded: false,
  }
];
