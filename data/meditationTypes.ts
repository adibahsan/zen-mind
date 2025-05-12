import { MeditationType } from '@/types';

export const meditationTypes: MeditationType[] = [
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    description: 'Focus on the present moment with non-judgmental awareness',
    icon: 'sun',
    color: '#6E9ECF'
  },
  {
    id: 'breathing',
    name: 'Breathing',
    description: 'Calm the mind through focused breathing techniques',
    icon: 'wind',
    color: '#A192C8'
  },
  {
    id: 'focus',
    name: 'Focus',
    description: 'Sharpen concentration and mental clarity',
    icon: 'target',
    color: '#F0A19B'
  },
  {
    id: 'loving-kindness',
    name: 'Loving Kindness',
    description: 'Cultivate compassion for yourself and others',
    icon: 'heart',
    color: '#E97777'
  },
  {
    id: 'body-scan',
    name: 'Body Scan',
    description: 'Progressive relaxation by focusing on each part of the body',
    icon: 'activity',
    color: '#7FB77E'
  },
  {
    id: 'gratitude',
    name: 'Gratitude',
    description: 'Develop appreciation for the positive aspects of life',
    icon: 'smile',
    color: '#FFB562'
  }
];

export const getMeditationTypeById = (id: string): MeditationType | undefined => {
  return meditationTypes.find(type => type.id === id);
};

export const getMeditationTypeColor = (id: string): string => {
  const type = getMeditationTypeById(id);
  return type ? type.color : '#6E9ECF';
};