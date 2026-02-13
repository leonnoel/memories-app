import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize } from '@/constants/typography';
import { Spacing, BorderRadius, Shadow, FrameDimensions, MAX_CONTENT_WIDTH } from '@/constants/layout';
import { Button } from '@/components/ui/Button';
import { FrameRenderer } from '@/components/frames/FrameRenderer';
import { FramePreview } from '@/components/frames/FramePreview';
import { FrameId, FrameInfo, FRAMES } from '@/constants/frames';
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

  const [activeFrameId, setActiveFrameId] = useState(frameId || FRAMES[0].id);
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Ref for the hidden full-resolution frame used for export
  const exportFrameRef = useRef<View>(null);
  // Ref for the visible preview (used as fallback)
  const previewFrameRef = useRef<View>(null);

  const frame = FRAMES.find((f) => f.id === activeFrameId) || FRAMES[0];
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
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
        setSaved(false);
        setError('');
      }
    } catch (err) {
      console.error('Image picker error:', err);
    }
  };

  const getExportElement = useCallback((): HTMLElement | null => {
    if (Platform.OS === 'web') {
      // Prefer the full-resolution hidden frame
      if (exportFrameRef.current) {
        return exportFrameRef.current as unknown as HTMLElement;
      }
      // Fallback to the preview
      if (previewFrameRef.current) {
        return previewFrameRef.current as unknown as HTMLElement;
      }
    }
    return null;
  }, []);

  // Get a thumbnail element (the visible preview) for gallery storage
  const getThumbnailElement = useCallback((): HTMLElement | null => {
    if (Platform.OS === 'web' && previewFrameRef.current) {
      return previewFrameRef.current as unknown as HTMLElement;
    }
    return null;
  }, []);

  const saveToGallery = async () => {
    const thumbEl = getThumbnailElement();
    if (thumbEl) {
      const dataUrl = await captureViewAsDataUrl(thumbEl);
      if (dataUrl) {
        await saveMemory({
          id: Date.now().toString(),
          frameId: frame.id,
          date: new Date().toISOString(),
          ageLabel: ageText,
          thumbnail: dataUrl,
        });
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const element = getExportElement();
      const blob = await captureViewAsBlob(element);
      if (blob) {
        const filename = `little-moments-${childName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
        await downloadImage(blob, filename);
        await saveToGallery();
        setSaved(true);
      } else {
        setError('Could not capture the image. Please try again.');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Something went wrong while saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    setError('');
    try {
      const element = getExportElement();
      const blob = await captureViewAsBlob(element);
      if (blob) {
        const filename = `little-moments-${childName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
        const shared = await shareImage(blob, filename);
        if (shared) {
          await saveToGallery();
          setSaved(true);
        }
      } else {
        setError('Could not capture the image. Please try again.');
      }
    } catch (err) {
      console.error('Share error:', err);
      setError('Something went wrong while sharing. Please try again.');
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

        {/* Visible preview frame */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={pickImage}
          accessibilityLabel={photoUri ? 'Change photo' : 'Add photo'}
        >
          <View
            ref={previewFrameRef}
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
          {!photoUri && (
            <View style={styles.tapOverlay}>
              <Text style={styles.tapIcon}>📷</Text>
              <Text style={styles.tapText}>Tap to add photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Hidden full-resolution frame for high-quality export */}
        <View
          ref={exportFrameRef}
          style={styles.hiddenExport}
          collapsable={false}
          pointerEvents="none"
        >
          <FrameRenderer
            frameId={frame.id as FrameId}
            photoUri={photoUri}
            childName={childName}
            ageText={ageText}
            width={FrameDimensions.width}
            height={FrameDimensions.height}
          />
        </View>

        {/* Frame switcher strip */}
        <View style={styles.frameSwitcher}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.frameSwitcherContent}
          >
            {FRAMES.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[
                  styles.frameSwitcherItem,
                  f.id === activeFrameId && styles.frameSwitcherItemActive,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  setActiveFrameId(f.id);
                  setSaved(false);
                }}
                accessibilityLabel={`Switch to ${f.name} frame`}
              >
                <View style={styles.frameSwitcherPreview}>
                  <FramePreview frameId={f.id} size={52} />
                </View>
                <Text
                  style={[
                    styles.frameSwitcherLabel,
                    f.id === activeFrameId && styles.frameSwitcherLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {f.emoji}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Photo upload button */}
        {photoUri && (
          <TouchableOpacity
            style={styles.photoButton}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            <Text style={styles.photoButtonIcon}>🔄</Text>
            <Text style={styles.photoButtonText}>Change Photo</Text>
          </TouchableOpacity>
        )}

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

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {!photoUri && (
          <Text style={styles.hint}>
            Tap the frame or the button above to add a photo
          </Text>
        )}

        {saved && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>
              Memory saved! 🎉
            </Text>
            <View style={styles.successActions}>
              <Button
                title="Create Another"
                onPress={() => router.replace('/create')}
                variant="ghost"
                size="sm"
              />
              <Button
                title="Go Home"
                onPress={() => router.replace('/home')}
                variant="ghost"
                size="sm"
              />
            </View>
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
  tapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: BorderRadius.lg,
  },
  tapIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  tapText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textInverse,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  // Hidden off-screen frame at full 1080x1350 for high-quality export
  hiddenExport: {
    position: 'absolute',
    left: -9999,
    top: 0,
    width: FrameDimensions.width,
    height: FrameDimensions.height,
    opacity: 1, // must be visible for html-to-image to capture
  },
  frameSwitcher: {
    marginTop: Spacing.md,
  },
  frameSwitcherContent: {
    paddingHorizontal: Spacing.xs,
    gap: Spacing.sm,
  },
  frameSwitcherItem: {
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frameSwitcherItemActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  frameSwitcherPreview: {
    width: 52,
    height: 65,
    borderRadius: 6,
    overflow: 'hidden',
  },
  frameSwitcherLabel: {
    fontSize: 16,
    marginTop: 2,
    textAlign: 'center',
  },
  frameSwitcherLabelActive: {
    fontFamily: FontFamily.bold,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md - 4,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  photoButtonIcon: {
    fontSize: 20,
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
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.danger,
    textAlign: 'center',
    marginTop: Spacing.md,
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
  successActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
});
