import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Platform, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize } from '@/constants/typography';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (fontError) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>Failed to load fonts</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingEmoji}>👶</Text>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'fade',
        }}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: 16,
  },
  loadingEmoji: {
    fontSize: 48,
  },
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.danger,
  },
});
