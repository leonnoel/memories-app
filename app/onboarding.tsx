import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize } from '@/constants/typography';
import { Spacing, BorderRadius, MAX_CONTENT_WIDTH } from '@/constants/layout';
import { Button } from '@/components/ui/Button';
import { saveChildInfo } from '@/utils/storage';

export default function OnboardingScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const validateAndSave = async () => {
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your little one\'s name');
      return;
    }

    const month = parseInt(birthMonth, 10);
    const year = parseInt(birthYear, 10);
    const day = parseInt(birthDay, 10);
    const now = new Date();

    if (!month || month < 1 || month > 12) {
      setError('Please enter a valid month (1-12)');
      return;
    }

    if (!year || year < 2000 || year > now.getFullYear()) {
      setError(`Please enter a valid year (2000-${now.getFullYear()})`);
      return;
    }

    if (!day || day < 1 || day > 31) {
      setError('Please enter a valid day (1-31)');
      return;
    }

    const birthday = new Date(year, month - 1, day);
    if (birthday > now) {
      setError('Birthday can\'t be in the future');
      return;
    }

    setSaving(true);
    try {
      await saveChildInfo({
        name: trimmedName,
        birthday: birthday.toISOString(),
      });
      router.replace('/home');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.emoji}>👶</Text>
            <Text style={styles.title}>Little Moments</Text>
            <Text style={styles.subtitle}>
              Capture beautiful monthly milestones{'\n'}of your little one growing up
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>What's your little one's name?</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Emma"
              placeholderTextColor={Colors.textLight}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={30}
            />

            <Text style={[styles.label, { marginTop: Spacing.lg }]}>
              When were they born?
            </Text>

            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <Text style={styles.dateLabel}>Month</Text>
                <TextInput
                  style={styles.dateInput}
                  value={birthMonth}
                  onChangeText={setBirthMonth}
                  placeholder="MM"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>

              <View style={styles.dateField}>
                <Text style={styles.dateLabel}>Day</Text>
                <TextInput
                  style={styles.dateInput}
                  value={birthDay}
                  onChangeText={setBirthDay}
                  placeholder="DD"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>

              <View style={[styles.dateField, { flex: 1.5 }]}>
                <Text style={styles.dateLabel}>Year</Text>
                <TextInput
                  style={styles.dateInput}
                  value={birthYear}
                  onChangeText={setBirthYear}
                  placeholder="YYYY"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>
            </View>

            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : null}

            <Button
              title="Let's Get Started ✨"
              onPress={validateAndSave}
              loading={saving}
              size="lg"
              style={styles.button}
            />
          </View>

          <Text style={styles.footer}>
            All data stays on your device. No account needed.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: Spacing['2xl'],
  },
  container: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: Spacing.lg,
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['5xl'],
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.lg,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 26,
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.lg,
    color: Colors.text,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md - 2,
    outlineStyle: 'none' as any,
  },
  dateRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dateField: {
    flex: 1,
  },
  dateLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  dateInput: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.lg,
    color: Colors.text,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md - 2,
    textAlign: 'center',
    outlineStyle: 'none' as any,
  },
  error: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.danger,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.lg,
  },
  footer: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
