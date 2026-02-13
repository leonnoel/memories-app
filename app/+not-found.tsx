import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize } from '@/constants/typography';
import { Spacing, MAX_CONTENT_WIDTH } from '@/constants/layout';
import { Button } from '@/components/ui/Button';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Lost cloud illustration */}
        <Svg width={180} height={120} viewBox="0 0 180 120" style={styles.illustration}>
          {/* Big cloud with question mark */}
          <Ellipse cx="90" cy="65" rx="65" ry="30" fill="white" />
          <Ellipse cx="120" cy="58" rx="50" ry="26" fill="white" />
          <Ellipse cx="55" cy="62" rx="45" ry="24" fill="white" />
          <Ellipse cx="85" cy="78" rx="55" ry="22" fill="white" />
          {/* Question mark */}
          <Path
            d="M82,50 Q82,42 90,42 Q98,42 98,50 Q98,55 90,58 L90,64"
            stroke={Colors.primary}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <Circle cx="90" cy="72" r="2.5" fill={Colors.primary} />
          {/* Small cloud */}
          <Ellipse cx="155" cy="30" rx="20" ry="10" fill="white" opacity={0.7} />
          <Ellipse cx="165" cy="28" rx="15" ry="8" fill="white" opacity={0.7} />
          {/* Bird */}
          <Path d="M25,25 Q32,18 39,25" stroke={Colors.text} strokeWidth="2" fill="none" opacity={0.3} />
          <Path d="M15,35 Q20,30 25,35" stroke={Colors.text} strokeWidth="1.5" fill="none" opacity={0.2} />
        </Svg>

        <Text style={styles.title}>Oops!</Text>
        <Text style={styles.message}>
          This page got lost in the clouds.{'\n'}Let's get you back home.
        </Text>

        <Button
          title="Go Home 🏠"
          onPress={() => router.replace('/home')}
          size="lg"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: MAX_CONTENT_WIDTH,
    width: '100%',
  },
  illustration: {
    marginBottom: Spacing.lg,
    opacity: 0.9,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['4xl'],
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  message: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.lg,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: Spacing.xl,
  },
  button: {
    width: '100%',
  },
});
