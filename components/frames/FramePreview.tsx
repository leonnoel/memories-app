import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FrameRenderer } from './FrameRenderer';
import { FrameId } from '@/constants/frames';
import { FrameDimensions } from '@/constants/layout';

interface FramePreviewProps {
  frameId: FrameId;
  size?: number;
}

export function FramePreview({ frameId, size = 160 }: FramePreviewProps) {
  const previewHeight = size * (FrameDimensions.height / FrameDimensions.width);

  return (
    <View style={[styles.container, { width: size, height: previewHeight }]}>
      <FrameRenderer
        frameId={frameId}
        childName="Baby"
        ageText="1 year"
        width={size}
        height={previewHeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 8,
  },
});
