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

export const Shadow = {
  sm: {
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
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
