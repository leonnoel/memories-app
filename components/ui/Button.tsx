import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize } from '@/constants/typography';
import { BorderRadius, Spacing } from '@/constants/layout';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        styles[`${variant}Container` as keyof typeof styles] as ViewStyle,
        styles[`${size}Container` as keyof typeof styles] as ViewStyle,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.textInverse}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              styles[`${variant}Text` as keyof typeof styles] as TextStyle,
              styles[`${size}Text` as keyof typeof styles] as TextStyle,
              icon ? { marginLeft: Spacing.sm } : undefined,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontFamily: FontFamily.bold,
  },

  // Variants
  primaryContainer: {
    backgroundColor: Colors.primary,
  },
  primaryText: {
    color: Colors.textInverse,
  },
  secondaryContainer: {
    backgroundColor: Colors.secondary,
  },
  secondaryText: {
    color: Colors.textInverse,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: Colors.primary,
  },

  // Sizes
  smContainer: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  smText: {
    fontSize: FontSize.sm,
  },
  mdContainer: {
    paddingVertical: Spacing.md - 2,
    paddingHorizontal: Spacing.lg,
  },
  mdText: {
    fontSize: FontSize.md,
  },
  lgContainer: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  lgText: {
    fontSize: FontSize.lg,
  },
});
