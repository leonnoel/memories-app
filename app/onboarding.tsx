import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize } from '@/constants/typography';
import { Spacing, BorderRadius, Shadow, MAX_CONTENT_WIDTH } from '@/constants/layout';
import { Button } from '@/components/ui/Button';
import { StyledInput } from '@/components/ui/StyledInput';
import { saveChildInfo } from '@/utils/storage';

export default function OnboardingScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Refs for auto-advancing between fields
  const monthRef = useRef<TextInput>(null);
  const dayRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const validateAndSave = async () => {
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter your little one's name");
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
      setError("Birthday can't be in the future");
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

  // Auto-advance: when month reaches 2 digits, jump to day
  const handleMonthChange = (val: string) => {
    setBirthMonth(val);
    if (val.length === 2) {
      dayRef.current?.focus();
    }
  };

  // Auto-advance: when day reaches 2 digits, jump to year
  const handleDayChange = (val: string) => {
    setBirthDay(val);
    if (val.length === 2) {
      yearRef.current?.focus();
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
            <Text style={styles.formQuestion}>
              What's your little one's name?
            </Text>
            <StyledInput
              value={name}
              onChangeText={setName}
              onSubmitEditing={() => monthRef.current?.focus()}
              placeholder="e.g. Emma"
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={30}
              returnKeyType="next"
              error={!!error && !name.trim()}
            />

            <Text style={[styles.formQuestion, { marginTop: Spacing.lg }]}>
              When were they born?
            </Text>

            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <StyledInput
                  ref={monthRef}
                  label="Month"
                  value={birthMonth}
                  onChangeText={handleMonthChange}
                  placeholder="MM"
                  keyboardType="number-pad"
                  maxLength={2}
                  returnKeyType="next"
                  style={styles.dateInput}
                />
              </View>

              <View style={styles.dateField}>
                <StyledInput
                  ref={dayRef}
                  label="Day"
                  value={birthDay}
                  onChangeText={handleDayChange}
                  placeholder="DD"
                  keyboardType="number-pad"
                  maxLength={2}
                  returnKeyType="next"
                  style={styles.dateInput}
                />
              </View>

              <View style={[styles.dateField, { flex: 1.5 }]}>
                <StyledInput
                  ref={yearRef}
                  label="Year"
                  value={birthYear}
                  onChangeText={setBirthYear}
                  onSubmitEditing={validateAndSave}
                  placeholder="YYYY"
                  keyboardType="number-pad"
                  maxLength={4}
                  returnKeyType="done"
                  style={styles.dateInput}
                />
              </View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

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
    ...Shadow.md,
  },
  formQuestion: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dateField: {
    flex: 1,
  },
  dateInput: {
    textAlign: 'center',
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
