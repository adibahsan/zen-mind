import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Minus, Plus } from 'lucide-react-native';

interface DurationPickerProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

export default function DurationPicker({ 
  value, 
  onChange, 
  min, 
  max 
}: DurationPickerProps) {
  const { colors } = useTheme();

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const predefinedValues = [5, 10, 15, 20, 30];

  return (
    <View style={styles.container}>
      <View style={styles.mainPicker}>
        <TouchableOpacity
          style={[
            styles.button,
            { 
              backgroundColor: value > min ? colors.primary : colors.disabledButton 
            }
          ]}
          onPress={handleDecrement}
          disabled={value <= min}
        >
          <Minus color="white" size={20} />
        </TouchableOpacity>
        
        <View style={[styles.valueContainer, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.button,
            { 
              backgroundColor: value < max ? colors.primary : colors.disabledButton 
            }
          ]}
          onPress={handleIncrement}
          disabled={value >= max}
        >
          <Plus color="white" size={20} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.presetContainer}>
        {predefinedValues.map((presetValue) => (
          <TouchableOpacity
            key={presetValue}
            style={[
              styles.presetButton,
              { 
                backgroundColor: value === presetValue ? colors.primary : colors.cardBackground,
              }
            ]}
            onPress={() => onChange(presetValue)}
          >
            <Text
              style={[
                styles.presetText,
                { color: value === presetValue ? 'white' : colors.textPrimary }
              ]}
            >
              {presetValue}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  mainPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueContainer: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  value: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 32,
    textAlign: 'center',
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  presetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  presetText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});