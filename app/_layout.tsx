import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { Colors } from '@/constants/colors';

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
        <Text style={styles.errorText}>Failed to load fonts. Please refresh.</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        {/* Branded splash with cloud and sun */}
        <View style={styles.splashIllustration}>
          <Svg width={160} height={100} viewBox="0 0 160 100">
            {/* Sun */}
            <Circle cx="130" cy="25" r="18" fill={Colors.accent} opacity={0.9} />
            <Circle cx="130" cy="25" r="24" fill={Colors.accent} opacity={0.2} />
            {/* Big cloud */}
            <Ellipse cx="60" cy="50" rx="45" ry="20" fill="white" />
            <Ellipse cx="90" cy="45" rx="35" ry="18" fill="white" />
            <Ellipse cx="35" cy="48" rx="30" ry="16" fill="white" />
            <Ellipse cx="70" cy="58" rx="38" ry="15" fill="white" />
            {/* Small cloud */}
            <Ellipse cx="135" cy="65" rx="22" ry="10" fill="white" opacity={0.7} />
            <Ellipse cx="148" cy="62" rx="16" ry="8" fill="white" opacity={0.7} />
            {/* Bird */}
            <Path d="M20,30 Q27,22 34,30" stroke={Colors.text} strokeWidth="2" fill="none" opacity={0.4} />
            <Path d="M40,25 Q45,20 50,25" stroke={Colors.text} strokeWidth="1.5" fill="none" opacity={0.3} />
          </Svg>
        </View>
        <Text style={styles.splashEmoji}>👶</Text>
        <Text style={styles.splashTitle}>Little Moments</Text>
        <Text style={styles.splashSubtitle}>Loading your memories...</Text>
        <ActivityIndicator
          size="small"
          color={Colors.primary}
          style={{ marginTop: 16 }}
        />
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
  },
  splashIllustration: {
    marginBottom: 8,
    opacity: 0.8,
  },
  splashEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  splashSubtitle: {
    fontSize: 15,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: Colors.danger,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
