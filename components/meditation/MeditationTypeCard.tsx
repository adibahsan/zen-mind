import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { 
  Sun, 
  Wind, 
  Target, 
  Heart, 
  Activity, 
  Smile 
} from 'lucide-react-native';
import { MeditationType } from '@/types';

interface MeditationTypeCardProps {
  type: MeditationType;
  isSelected: boolean;
  onSelect: () => void;
}

export default function MeditationTypeCard({ 
  type,
  isSelected,
  onSelect
}: MeditationTypeCardProps) {
  const { colors } = useTheme();
  
  const renderIcon = () => {
    const iconProps = {
      size: 24,
      color: 'white',
    };
    
    switch (type.icon) {
      case 'sun':
        return <Sun {...iconProps} />;
      case 'wind':
        return <Wind {...iconProps} />;
      case 'target':
        return <Target {...iconProps} />;
      case 'heart':
        return <Heart {...iconProps} />;
      case 'activity':
        return <Activity {...iconProps} />;
      case 'smile':
        return <Smile {...iconProps} />;
      default:
        return <Sun {...iconProps} />;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container, 
        { 
          backgroundColor: colors.cardBackground,
          borderColor: isSelected ? type.color : 'transparent',
        }
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: type.color }]}>
        {renderIcon()}
      </View>
      <Text style={[
        styles.title, 
        { 
          color: colors.textPrimary,
          fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Medium',
        }
      ]}>
        {type.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
  },
});