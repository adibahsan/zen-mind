import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Define theme colors
const lightTheme = {
  primary: '#6E9ECF',
  secondary: '#A192C8',
  accent: '#F0A19B',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  background: '#F7F7F7',
  cardBackground: '#FFFFFF',
  textPrimary: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  disabledButton: '#CCCCCC',
};

const darkTheme = {
  primary: '#6E9ECF',
  secondary: '#A192C8',
  accent: '#F0A19B',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  background: '#121212',
  cardBackground: '#1E1E1E',
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#333333',
  disabledButton: '#444444',
};

// Define spacing
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Context type definition
type ThemeContextType = {
  isDark: boolean;
  colors: typeof lightTheme;
  spacing: typeof spacing;
  toggleTheme: () => void;
};

// Create context with default value
const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightTheme,
  spacing,
  toggleTheme: () => {},
});

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  // Update theme based on system preference
  useEffect(() => {
    setIsDark(colorScheme === 'dark');
  }, [colorScheme]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Get current theme colors
  const colors = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, colors, spacing, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);