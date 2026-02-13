import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize } from '@/constants/typography';
import { Spacing, BorderRadius, Shadow, MAX_CONTENT_WIDTH } from '@/constants/layout';
import { Button } from '@/components/ui/Button';
import { StyledInput } from '@/components/ui/StyledInput';
import { useChildInfo } from '@/hooks/useChildInfo';
import { clearAllData, saveChildInfo } from '@/utils/storage';
import { validateBirthday } from '@/utils/validation';

export default function SettingsScreen() {
  const router = useRouter();
  const { childInfo, refresh } = useChildInfo();
  const [name, setName] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const dayRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  useEffect(() => {
    if (childInfo) {
      setName(childInfo.name);
      const bday = new Date(childInfo.birthday);
      setBirthMonth(String(bday.getMonth() + 1));
      setBirthDay(String(bday.getDate()));
      setBirthYear(String(bday.getFullYear()));
    }
  }, [childInfo]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setMessage("Please enter your child's name");
      return;
    }

    const validation = validateBirthday(birthMonth, birthDay, birthYear);
    if (!validation.valid) {
      setMessage(validation.error!);
      return;
    }

    setSaving(true);
    try {
      await saveChildInfo({
        name: trimmedName,
        birthday: validation.birthday!.toISOString(),
      });
      await refresh();
      setMessage('Saved!');
      setTimeout(() => setMessage(''), 2000);
    } catch {
      setMessage('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleClearData = () => {
    if (Platform.OS === 'web') {
      if (
        window.confirm(
          'This will delete all your data including saved memories. Are you sure?'
        )
      ) {
        clearAllData().then(() => router.replace('/onboarding'));
      }
    } else {
      Alert.alert(
        'Clear All Data',
        'This will delete all your data including saved memories. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete Everything',
            style: 'destructive',
            onPress: () =>
              clearAllData().then(() => router.replace('/onboarding')),
          },
        ]
      );
    }
  };

  const handleMonthChange = (val: string) => {
    setBirthMonth(val);
    if (val.length === 2) dayRef.current?.focus();
  };

  const handleDayChange = (val: string) => {
    setBirthDay(val);
    if (val.length === 2) yearRef.current?.focus();
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Button
            title="← Back"
            onPress={() => router.back()}
            variant="ghost"
            size="sm"
          />
          <Text style={styles.title}>Settings</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.form}>
          <StyledInput
            label="Child's Name"
            value={name}
            onChangeText={setName}
            placeholder="Name"
            maxLength={30}
          />

          <Text style={[styles.dateHeading, { marginTop: Spacing.lg }]}>
            Birthday
          </Text>
          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <StyledInput
                label="Month"
                value={birthMonth}
                onChangeText={handleMonthChange}
                placeholder="MM"
                keyboardType="number-pad"
                maxLength={2}
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
                style={styles.dateInput}
              />
            </View>
            <View style={[styles.dateField, { flex: 1.5 }]}>
              <StyledInput
                ref={yearRef}
                label="Year"
                value={birthYear}
                onChangeText={setBirthYear}
                placeholder="YYYY"
                keyboardType="number-pad"
                maxLength={4}
                style={styles.dateInput}
              />
            </View>
          </View>

          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={saving}
            style={{ marginTop: Spacing.lg }}
          />

          {message ? (
            <Text
              style={[
                styles.message,
                message !== 'Saved!' && { color: Colors.danger },
              ]}
            >
              {message}
            </Text>
          ) : null}
        </View>

        <Button
          title="Clear All Data"
          onPress={handleClearData}
          variant="outline"
          style={styles.dangerButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: Spacing['2xl'],
  },
  container: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.text,
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadow.md,
  },
  dateHeading: {
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
  message: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.success,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  dangerButton: {
    marginTop: Spacing.xl,
    borderColor: Colors.danger,
  },
});
