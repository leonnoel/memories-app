import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize } from '@/constants/typography';
import { Spacing, BorderRadius, MAX_CONTENT_WIDTH } from '@/constants/layout';
import { Button } from '@/components/ui/Button';
import { MemoryEntry } from '@/utils/storage';

interface MemoryViewerProps {
  memory: MemoryEntry | null;
  visible: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export function MemoryViewer({ memory, visible, onClose, onDelete }: MemoryViewerProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const imageWidth = Math.min(windowWidth - Spacing.lg * 2, MAX_CONTENT_WIDTH);
  const imageHeight = imageWidth * (5 / 4); // 4:5 aspect ratio

  if (!memory) return null;

  const date = new Date(memory.date);
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="Close"
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            {/* Memory image */}
            <View style={[styles.imageContainer, { width: imageWidth, height: imageHeight }]}>
              <Image
                source={{ uri: memory.thumbnail }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            {/* Info */}
            <Text style={styles.ageLabel}>{memory.ageLabel}</Text>
            <Text style={styles.dateLabel}>{dateStr}</Text>

            {/* Actions */}
            <View style={styles.actions}>
              <Button
                title="Close"
                onPress={onClose}
                variant="outline"
                size="md"
                style={{ flex: 1 }}
              />
              {onDelete && (
                <Button
                  title="Delete"
                  onPress={() => {
                    onDelete(memory.id);
                    onClose();
                  }}
                  variant="ghost"
                  size="md"
                  style={{ flex: 1 }}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  content: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  closeText: {
    fontSize: 18,
    color: Colors.text,
    fontFamily: FontFamily.bold,
  },
  imageContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ageLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textInverse,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  dateLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.primaryLight,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    width: '100%',
  },
});
