import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Frown, Meh, Smile, SmilePlus, SmileMinus } from 'lucide-react-native';

interface MoodSelectorProps {
  selectedMood: number;
  onSelectMood: (mood: number) => void;
}

export default function MoodSelector({ 
  selectedMood, 
  onSelectMood 
}: MoodSelectorProps) {
  const { colors } = useTheme();

  const moods = [
    { value: 1, icon: Frown, label: 'Very Bad' },
    { value: 2, icon: SmileMinus, label: 'Bad' },
    { value: 3, icon: Meh, label: 'Neutral' },
    { value: 4, icon: Smile, label: 'Good' },
    { value: 5, icon: SmilePlus, label: 'Very Good' },
  ];

  return (
    <View style={styles.container}>
      {moods.map((mood) => {
        const Icon = mood.icon;
        const isSelected = selectedMood === mood.value;
        
        return (
          <TouchableOpacity
            key={mood.value}
            style={styles.moodItem}
            onPress={() => onSelectMood(mood.value)}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <Icon
                size={24}
                color={isSelected ? 'white' : colors.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.moodLabel,
                {
                  color: isSelected ? colors.primary : colors.textSecondary,
                  fontFamily: isSelected ? 'Inter-Medium' : 'Inter-Regular',
                },
              ]}
            >
              {mood.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodItem: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default MoodSelector