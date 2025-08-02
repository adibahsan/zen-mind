import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface QuickStartButtonProps {
  title: string;
  subtitle: string;
  onPress: () => void;
  icon: keyof typeof Feather.glyphMap;
  color: string;
}

const QuickStartButton: React.FC<QuickStartButtonProps> = ({ title, subtitle, onPress, icon, color }) => {
  const { colors, spacing } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: color, borderRadius: 16 }]}>
      <View style={styles.content}>
        <Feather name={icon} size={28} color={colors.cardBackground} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.cardBackground }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.cardBackground }]}>{subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 8,
    height: 140,
    padding: 16,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 20,
    opacity: 0.9,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
});

export default QuickStartButton;
