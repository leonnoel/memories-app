import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize } from '@/constants/typography';
import { Spacing, BorderRadius, Shadow, MAX_CONTENT_WIDTH } from '@/constants/layout';
import { Button } from '@/components/ui/Button';
import { MilestoneReminder } from '@/components/MilestoneReminder';
import { MemoryViewer } from '@/components/MemoryViewer';
import { useChildInfo } from '@/hooks/useChildInfo';
import { useMemories } from '@/hooks/useMemories';
import { calculateAge, formatAge } from '@/utils/age';
import { MemoryEntry } from '@/utils/storage';

export default function HomeScreen() {
  const router = useRouter();
  const { childInfo, refresh: refreshChild } = useChildInfo();
  const { memories, refresh: refreshMemories, remove: removeMemory } = useMemories();
  const [selectedMemory, setSelectedMemory] = useState<MemoryEntry | null>(null);

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
          <View>
            <Text style={styles.appName}>Little Moments</Text>
            <Text style={styles.appTagline}>Growing memories 💙</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            style={styles.settingsButton}
            accessibilityLabel="Settings"
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Age Card */}
        <View style={styles.ageCard}>
          {/* Decorative clouds */}
          <View style={styles.ageCardDecorTop}>
            <Svg width={80} height={30} viewBox="0 0 80 30" style={{ position: 'absolute', top: 8, left: 20, opacity: 0.3 }}>
              <Ellipse cx="30" cy="18" rx="25" ry="10" fill={Colors.primaryLight} />
              <Ellipse cx="50" cy="15" rx="20" ry="9" fill={Colors.primaryLight} />
            </Svg>
            <Svg width={60} height={25} viewBox="0 0 60 25" style={{ position: 'absolute', top: 15, right: 25, opacity: 0.25 }}>
              <Ellipse cx="25" cy="14" rx="20" ry="9" fill={Colors.primaryLight} />
              <Ellipse cx="40" cy="12" rx="16" ry="7" fill={Colors.primaryLight} />
            </Svg>
          </View>

          <View style={styles.ageCardInner}>
            {/* Sun */}
            <Svg width={44} height={44} viewBox="0 0 44 44" style={{ marginBottom: Spacing.sm }}>
              <Circle cx="22" cy="22" r="11" fill={Colors.accent} />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const x1 = 22 + Math.cos(rad) * 15;
                const y1 = 22 + Math.sin(rad) * 15;
                const x2 = 22 + Math.cos(rad) * 19;
                const y2 = 22 + Math.sin(rad) * 19;
                return (
                  <Path
                    key={i}
                    d={`M${x1},${y1} L${x2},${y2}`}
                    stroke={Colors.accent}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                );
              })}
            </Svg>

            <Text style={styles.childName}>{childInfo.name}</Text>
            <Text style={styles.ageIs}>is</Text>
            <Text style={styles.ageText}>{ageText}</Text>
            <Text style={styles.ageOld}>old today!</Text>
          </View>
        </View>

        {/* Milestone Reminder */}
        <MilestoneReminder
          childName={childInfo.name}
          age={age}
          memories={memories}
        />

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
                <TouchableOpacity
                  key={memory.id}
                  style={styles.memoryCard}
                  activeOpacity={0.8}
                  onPress={() => setSelectedMemory(memory)}
                  accessibilityLabel={`Memory: ${memory.ageLabel}`}
                >
                  <Image
                    source={{ uri: memory.thumbnail }}
                    style={styles.memoryThumb}
                    resizeMode="cover"
                  />
                  <View style={styles.memoryOverlay}>
                    <Text style={styles.memoryAge}>{memory.ageLabel}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Empty state */}
        {memories.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIllustration}>
              <Svg width={100} height={80} viewBox="0 0 100 80">
                {/* Camera icon */}
                <Path
                  d="M15,25 L35,25 L40,18 L60,18 L65,25 L85,25 L85,65 L15,65 Z"
                  fill={Colors.primaryLight}
                  stroke={Colors.primary}
                  strokeWidth="2"
                />
                <Circle cx="50" cy="44" r="14" fill="none" stroke={Colors.primary} strokeWidth="2" />
                <Circle cx="50" cy="44" r="8" fill={Colors.primaryLight} />
                <Circle cx="75" cy="32" r="3" fill={Colors.accent} />
              </Svg>
            </View>
            <Text style={styles.emptyTitle}>No memories yet</Text>
            <Text style={styles.emptyText}>
              Tap the button above to create your{'\n'}first beautiful milestone photo!
            </Text>
          </View>
        )}
      </View>

      {/* Memory viewer modal */}
      <MemoryViewer
        memory={selectedMemory}
        visible={selectedMemory !== null}
        onClose={() => setSelectedMemory(null)}
        onDelete={(id) => {
          removeMemory(id);
          setSelectedMemory(null);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing['3xl'],
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
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  appName: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['2xl'],
    color: Colors.primary,
  },
  appTagline: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textLight,
    marginTop: 2,
  },
  settingsButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    ...Shadow.sm,
  },
  settingsIcon: {
    fontSize: 22,
  },
  ageCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  ageCardDecorTop: {
    height: 40,
    position: 'relative',
  },
  ageCardInner: {
    alignItems: 'center',
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
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
    marginVertical: 2,
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
    marginTop: 2,
  },
  ctaButton: {
    marginBottom: Spacing.lg,
  },
  gallerySection: {
    marginTop: Spacing.sm,
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
    width: '48.5%',
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
  memoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(44, 62, 80, 0.6)',
    paddingVertical: Spacing.xs,
  },
  memoryAge: {
    color: Colors.textInverse,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    padding: Spacing.xl,
  },
  emptyIllustration: {
    marginBottom: Spacing.md,
    opacity: 0.8,
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
    lineHeight: 22,
  },
});
