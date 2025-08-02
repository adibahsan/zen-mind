import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppDataProvider } from '@/context/AppDataContext';
import { AudioPlayerProvider } from '@/context/AudioPlayerContext';
import { MinimizedPlayer } from '@/components/player/MinimizedPlayer';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { View } from 'react-native';
import ZenLoadingScreen from '@/components/common/ZenLoadingScreen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Show custom zen loading screen while fonts are loading
  if (!fontsLoaded && !fontError) {
    return <ZenLoadingScreen />;
  }

  return (
    <ThemeProvider>
      <AppDataProvider>
        <AudioPlayerProvider>
          <>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <MinimizedPlayer />
            <StatusBar style="auto" />
          </>
        </AudioPlayerProvider>
      </AppDataProvider>
    </ThemeProvider>
  );
}