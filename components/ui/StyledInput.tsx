import React, { useState, forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  Platform,
  View,
  Text,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize } from '@/constants/typography';
import { Spacing, BorderRadius } from '@/constants/layout';

interface StyledInputProps extends TextInputProps {
  label?: string;
  error?: boolean;
}

export const StyledInput = forwardRef<TextInput, StyledInputProps>(
  function StyledInput({ label, error, style, ...props }, ref) {
    const [focused, setFocused] = useState(false);

    return (
      <View>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={ref}
          {...props}
          style={[
            styles.input,
            focused && styles.inputFocused,
            error && styles.inputError,
            style,
          ]}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={Colors.textLight}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  input: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.lg,
    color: Colors.text,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md - 2,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  inputError: {
    borderColor: Colors.danger,
  },
});
