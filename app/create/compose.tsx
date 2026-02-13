import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize } from '@/constants/typography';
import { Spacing, BorderRadius, Shadow, FrameDimensions, MAX_CONTENT_WIDTH } from '@/constants/layout';
import { Button } from '@/components/ui/Button';
import { FrameRenderer } from '@/components/frames/FrameRenderer';
import { FrameId, FRAMES } from '@/constants/frames';
import { useChildInfo } from '@/hooks/useChildInfo';
import { useMemories } from '@/hooks/useMemories';
import { calculateAge, formatAge } from '@/utils/age';
import { captureViewAsBlob, captureViewAsDataUrl, downloadImage, shareImage } from '@/utils/imageUtils';

export default function ComposeScreen() {
  const router = useRouter();
  const { frameId } = useLocalSearchParams<{ frameId: string }>();
  const { childInfo } = useChildInfo();
  const { save: saveMemory } = useMemories();
  const { width: windowWidth } = useWindowDimensions();

  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [saved, setSaved] = useState(false);
  const frameRef = useRef<View>(null);

  const frame = FRAMES.find((f) => f.id === frameId) || FRAMES[0];
  const contentWidth = Math.min(windowWidth - Spacing.lg * 2, MAX_CONTENT_WIDTH);
  const frameDisplayWidth = contentWidth;
  const frameDisplayHeight = frameDisplayWidth * (FrameDimensions.height / FrameDimensions.width);

  const childName = childInfo?.name || 'Baby';
  const age = childInfo?.birthday
    ? calculateAge(new Date(childInfo.birthday))
    : { years: 0, months: 0, totalMonths: 0 };
  const ageText = formatAge(age);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
        setSaved(false);
      }
    } catch (err) {
      console.error('Image picker error:', err);
    }
  };

  const getFrameElement = useCallback((): HTMLElement | null => {
    if (Platform.OS === 'web' && frameRef.current) {
      // On web, View refs expose the DOM node
      return frameRef.current as unknown as HTMLElement;
    }
    return null;
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const element = getFrameElement();
      const blob = await captureViewAsBlob(element);
      if (blob) {
        const filename = `little-moments-${childName.toLowerCase()}-${Date.now()}.png`;
        await downloadImage(blob, filename);

        // Save thumbnail to memory gallery
        const dataUrl = await captureViewAsDataUrl(element);
        if (dataUrl) {
          await saveMemory({
            id: Date.now().toString(),
            frameId: frame.id,
            date: new Date().toISOString(),
            ageLabel: ageText,
            thumbnail: dataUrl,
          });
        }

        setSaved(true);
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const element = getFrameElement();
      const blob = await captureViewAsBlob(element);
      if (blob) {
        const filename = `little-moments-${childName.toLowerCase()}-${Date.now()}.png`;
        const shared = await shareImage(blob, filename);

        if (shared) {
          // Save thumbnail to memory gallery
          const dataUrl = await captureViewAsDataUrl(element);
          if (dataUrl) {
            await saveMemory({
              id: Date.now().toString(),
              frameId: frame.id,
              date: new Date().toISOString(),
              ageLabel: ageText,
              thumbnail: dataUrl,
            });
          }
          setSaved(true);
        }
      }
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Button
            title="← Frames"
            onPress={() => router.back()}
            variant="ghost"
            size="sm"
          />
          <Text style={styles.title}>{frame.emoji} {frame.name}</Text>
          <View style={{ width: 70 }} />
        </View>

        {/* Frame display */}
        <View
          ref={frameRef}
          style={[
            styles.frameContainer,
            { width: frameDisplayWidth, height: frameDisplayHeight },
          ]}
          collapsable={false}
        >
          <FrameRenderer
            frameId={frame.id as FrameId}
            photoUri={photoUri}
            childName={childName}
            ageText={ageText}
            width={frameDisplayWidth}
            height={frameDisplayHeight}
          />
        </View>

        {/* Photo upload prompt */}
        <TouchableOpacity
          style={styles.photoButton}
          onPress={pickImage}
          activeOpacity={0.7}
        >
          <Text style={styles.photoButtonIcon}>
            {photoUri ? '🔄' : '📷'}
          </Text>
          <Text style={styles.photoButtonText}>
            {photoUri ? 'Change Photo' : 'Add Photo'}
          </Text>
        </TouchableOpacity>

        {/* Action buttons */}
        <View style={styles.actions}>
          <Button
            title={saved ? '✓ Saved!' : '💾 Save to Device'}
            onPress={handleSave}
            loading={saving}
            disabled={!photoUri}
            variant={saved ? 'outline' : 'primary'}
            size="lg"
            style={styles.actionButton}
          />
          <Button
            title="📤 Share with Family"
            onPress={handleShare}
            loading={sharing}
            disabled={!photoUri}
            variant="secondary"
            size="lg"
            style={styles.actionButton}
          />
        </View>

        {!photoUri && (
          <Text style={styles.hint}>
            Tap "Add Photo" to get started!
          </Text>
        )}

        {saved && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>
              Memory saved! 🎉
            </Text>
            <Button
              title="Create Another"
              onPress={() => router.replace('/create')}
              variant="ghost"
              size="sm"
            />
          </View>
        )}
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
    paddingTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.text,
    textAlign: 'center',
    flex: 1,
  },
  frameContainer: {
    alignSelf: 'center',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.lg,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  photoButtonIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  photoButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  actions: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  actionButton: {
    width: '100%',
  },
  hint: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  successBanner: {
    backgroundColor: '#E8F8F0',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  successText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.success,
    marginBottom: Spacing.sm,
  },
});
