import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize } from '@/constants/typography';
import { Spacing, BorderRadius, Shadow, MAX_CONTENT_WIDTH } from '@/constants/layout';
import { Button } from '@/components/ui/Button';
import { useChildInfo } from '@/hooks/useChildInfo';
import { useMemories } from '@/hooks/useMemories';
import { calculateAge, formatAge } from '@/utils/age';
import Svg, { Circle, Path, Rect, G, Defs, RadialGradient, Stop } from 'react-native-svg';

export default function HomeScreen() {
  const router = useRouter();
  const { childInfo, refresh: refreshChild } = useChildInfo();
  const { memories, refresh: refreshMemories } = useMemories();

  useFocusEffect(
    useCallback(() => {
      refreshChild();
      refreshMemories();
    }, [refreshChild, refreshMemories])
  );

  if (!childInfo) return null;

  const birthday = new Date(childInfo.birthday);
  const age = calculateAge(birthday);
  const ageText = formatAge(age);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.appName}>Little Moments</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            style={styles.settingsButton}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Age Card */}
        <View style={styles.ageCard}>
          <View style={styles.ageCardInner}>
            <SunIcon />
            <Text style={styles.childName}>{childInfo.name}</Text>
            <Text style={styles.ageIs}>is</Text>
            <Text style={styles.ageText}>{ageText}</Text>
            <Text style={styles.ageOld}>old today!</Text>
          </View>
          <View style={styles.ageCardDecor}>
            <CloudSmall style={{ position: 'absolute', top: 12, left: 20 }} />
            <CloudSmall style={{ position: 'absolute', top: 24, right: 30 }} />
          </View>
        </View>

        {/* CTA */}
        <Button
          title="Create New Memory ✨"
          onPress={() => router.push('/create')}
          size="lg"
          style={styles.ctaButton}
        />

        {/* Memories Gallery */}
        {memories.length > 0 && (
          <View style={styles.gallerySection}>
            <Text style={styles.galleryTitle}>Your Memories</Text>
            <View style={styles.galleryGrid}>
              {memories.map((memory) => (
                <View key={memory.id} style={styles.memoryCard}>
                  <Image
                    source={{ uri: memory.thumbnail }}
                    style={styles.memoryThumb}
                    resizeMode="cover"
                  />
                  <Text style={styles.memoryAge}>{memory.ageLabel}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty state */}
        {memories.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📸</Text>
            <Text style={styles.emptyTitle}>No memories yet</Text>
            <Text style={styles.emptyText}>
              Create your first beautiful milestone photo!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Small decorative cloud component
function CloudSmall({ style }: { style?: any }) {
  return (
    <View style={style}>
      <Svg width={48} height={24} viewBox="0 0 48 24">
        <Circle cx="16" cy="16" r="8" fill={Colors.primaryLight} opacity={0.5} />
        <Circle cx="28" cy="14" r="10" fill={Colors.primaryLight} opacity={0.5} />
        <Circle cx="38" cy="16" r="7" fill={Colors.primaryLight} opacity={0.5} />
      </Svg>
    </View>
  );
}

// Decorative sun icon
function SunIcon() {
  return (
    <View style={{ marginBottom: Spacing.sm }}>
      <Svg width={48} height={48} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="12" fill={Colors.accent} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 24 + Math.cos(rad) * 16;
          const y1 = 24 + Math.sin(rad) * 16;
          const x2 = 24 + Math.cos(rad) * 21;
          const y2 = 24 + Math.sin(rad) * 21;
          return (
            <Path
              key={i}
              d={`M${x1},${y1} L${x2},${y2}`}
              stroke={Colors.accent}
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing['2xl'],
  },
  container: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['2xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerLeft: {},
  appName: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['2xl'],
    color: Colors.primary,
  },
  settingsButton: {
    padding: Spacing.sm,
  },
  settingsIcon: {
    fontSize: 24,
  },
  ageCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadow.lg,
  },
  ageCardInner: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  ageCardDecor: {
    height: 40,
    position: 'relative',
  },
  childName: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['4xl'],
    color: Colors.text,
    textAlign: 'center',
  },
  ageIs: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.lg,
    color: Colors.textLight,
    marginVertical: Spacing.xs,
  },
  ageText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.primary,
    textAlign: 'center',
  },
  ageOld: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.lg,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  ctaButton: {
    marginTop: Spacing.lg,
  },
  gallerySection: {
    marginTop: Spacing.xl,
  },
  galleryTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  memoryCard: {
    width: '48%',
    aspectRatio: 4 / 5,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    ...Shadow.sm,
  },
  memoryThumb: {
    width: '100%',
    height: '100%',
  },
  memoryAge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(44, 62, 80, 0.6)',
    color: Colors.textInverse,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    paddingVertical: Spacing.xs,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: Spacing['3xl'],
    padding: Spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
