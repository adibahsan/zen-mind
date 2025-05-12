import { BreathingPattern } from '@/types';

export const breathingPatterns: BreathingPattern[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Technique',
    description: 'Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Calms anxiety and helps with sleep.',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal parts inhale, hold, exhale, and hold. Creates mental clarity and reduces stress.',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4
  },
  {
    id: 'deep',
    name: 'Deep Breathing',
    description: 'Slow, deep breaths to increase oxygen flow and reduce tension in the body.',
    inhale: 5,
    hold1: 0,
    exhale: 5,
    hold2: 0
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    description: 'Equal inhale and exhale to balance the nervous system and improve heart rate variability.',
    inhale: 6,
    hold1: 0,
    exhale: 6,
    hold2: 0
  },
  {
    id: 'alternate-nostril',
    name: 'Alternate Nostril',
    description: 'Traditional yogic breathing to balance the nervous system and improve focus.',
    inhale: 4,
    hold1: 2,
    exhale: 4,
    hold2: 0
  }
];