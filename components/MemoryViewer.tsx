import React, { useState } from 'react';
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
import { Spacing, BorderRadius, Shadow, MAX_CONTENT_WIDTH } from '@/constants/layout';
import { Button } from '@/components/ui/Button';
import { MemoryEntry } from '@/utils/storage';

interface MemoryViewerProps {
  memory: MemoryEntry | null;
  visible: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export function MemoryViewer({ memory, visible, onClose, onDelete }: MemoryViewerProps) {
  const { width: windowWidth } = useWindowDimensions();
  const imageWidth = Math.min(windowWidth - Spacing.lg * 2, MAX_CONTENT_WIDTH);
  const imageHeight = imageWidth * (5 / 4); // 4:5 aspect ratio
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!memory) return null;

  const date = new Date(memory.date);
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleClose = () => {
    setConfirmDelete(false);
    onClose();
  };

  const handleDeletePress = () => {
    setConfirmDelete(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete && memory) {
      onDelete(memory.id);
    }
    setConfirmDelete(false);
    onClose();
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
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
              onPress={handleClose}
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

            {/* Delete confirmation */}
            {confirmDelete ? (
              <View style={styles.confirmBox}>
                <Text style={styles.confirmText}>
                  Delete this memory? This can't be undone.
                </Text>
                <View style={styles.confirmActions}>
                  <Button
                    title="Cancel"
                    onPress={handleDeleteCancel}
                    variant="outline"
                    size="sm"
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Yes, Delete"
                    onPress={handleDeleteConfirm}
                    variant="primary"
                    size="sm"
                    style={{ flex: 1, backgroundColor: Colors.danger }}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.actions}>
                <Button
                  title="Close"
                  onPress={handleClose}
                  variant="outline"
                  size="md"
                  style={{ flex: 1 }}
                />
                {onDelete && (
                  <Button
                    title="Delete"
                    onPress={handleDeletePress}
                    variant="ghost"
                    size="md"
                    style={{ flex: 1 }}
                  />
                )}
              </View>
            )}
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
    ...Shadow.md,
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
    ...Shadow.lg,
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
  confirmBox: {
    marginTop: Spacing.lg,
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  confirmText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
});
