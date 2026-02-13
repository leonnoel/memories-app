import { TextStyle } from 'react-native';

export const FontFamily = {
  regular: 'Nunito_400Regular',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
} as const;

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    lineHeight: 36,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    lineHeight: 32,
  },
  h3: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    lineHeight: 28,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    lineHeight: 24,
  },
  bodyBold: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    lineHeight: 24,
  },
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  button: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    lineHeight: 24,
  },
  // Frame-specific
  frameName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    lineHeight: 36,
  },
  frameAge: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize['2xl'],
    lineHeight: 32,
  },
};
