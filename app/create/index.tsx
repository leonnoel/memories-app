import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize } from '@/constants/typography';
import { Spacing, BorderRadius, Shadow, MAX_CONTENT_WIDTH } from '@/constants/layout';
import { Button } from '@/components/ui/Button';
import { FRAMES } from '@/constants/frames';
import { FramePreview } from '@/components/frames/FramePreview';
import { useChildInfo } from '@/hooks/useChildInfo';
import { calculateAge, formatAge } from '@/utils/age';

export default function FrameSelectionScreen() {
  const router = useRouter();
  const { childInfo } = useChildInfo();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - Spacing.lg * 2, MAX_CONTENT_WIDTH);
  const cardWidth = (contentWidth - Spacing.md) / 2;

  const childName = childInfo?.name || 'Baby';
  const age = childInfo?.birthday
    ? calculateAge(new Date(childInfo.birthday))
    : { years: 0, months: 0, totalMonths: 0 };
  const ageText = formatAge(age);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Button
            title="← Back"
            onPress={() => router.back()}
            variant="ghost"
            size="sm"
          />
          <Text style={styles.title}>Choose a Frame</Text>
          <View style={{ width: 60 }} />
        </View>

        <Text style={styles.subtitle}>
          Pick a beautiful frame for this month's memory
        </Text>

        <View style={styles.grid}>
          {FRAMES.map((frame) => (
            <TouchableOpacity
              key={frame.id}
              style={[styles.frameCard, { width: cardWidth }]}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: '/create/compose',
                  params: { frameId: frame.id },
                })
              }
            >
              <View style={styles.framePreviewContainer}>
                <FramePreview
                  frameId={frame.id}
                  size={cardWidth - Spacing.md * 2}
                  childName={childName}
                  ageText={ageText}
                />
              </View>
              <Text style={styles.frameName}>
                {frame.emoji} {frame.name}
              </Text>
              <Text style={styles.frameDesc}>{frame.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  frameCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadow.md,
  },
  framePreviewContainer: {
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  frameName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.text,
    textAlign: 'center',
  },
  frameDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 2,
  },
});
