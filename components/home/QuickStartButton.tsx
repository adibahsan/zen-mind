import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Wind, Target, Heart, Activity, Smile } from 'lucide-react-native';

interface QuickStartButtonProps {
  title: string;
  subtitle: string;
  onPress: () => void;
  icon: string;
  color: string;
}

export default function QuickStartButton({ 
  title, 
  subtitle, 
  onPress, 
  icon,
  color 
}: QuickStartButtonProps) {
  const { colors } = useTheme();
  
  const renderIcon = () => {
    const iconProps = {
      size: 24,
      color: 'white',
    };
    
    switch (icon) {
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
      style={[styles.container, { backgroundColor: colors.cardBackground }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        {renderIcon()}
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '30%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
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
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
});