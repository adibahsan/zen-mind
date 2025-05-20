import { Stack } from 'expo-router';

export default function MeditateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="breathing" />
      <Stack.Screen name="timer" />
    </Stack>
  );
}
