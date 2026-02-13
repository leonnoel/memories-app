import { Platform, ViewStyle } from 'react-native';

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// Cross-platform shadows: uses boxShadow on web, shadow* props on native
function makeShadow(
  offsetY: number,
  blur: number,
  opacity: number,
  elevation: number
): ViewStyle {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `0px ${offsetY}px ${blur}px rgba(44, 62, 80, ${opacity})`,
    } as any;
  }
  return {
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: blur,
    elevation,
  };
}

export const Shadow = {
  sm: makeShadow(1, 2, 0.05, 1),
  md: makeShadow(2, 8, 0.08, 3),
  lg: makeShadow(4, 16, 0.12, 6),
} as const;

// Frame dimensions for the composed image
export const FrameDimensions = {
  width: 1080,
  height: 1350,
  aspectRatio: 4 / 5,
  photoCircleRadius: 270, // ~540px diameter
  photoCircleCenterX: 540, // centered horizontally
  photoCircleCenterY: 540, // positioned at 40% from top
} as const;

// Maximum content width on larger screens
export const MAX_CONTENT_WIDTH = 480;
