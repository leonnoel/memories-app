import React, { useState, useEffect } from 'react';
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
import { Spacing, BorderRadius, MAX_CONTENT_WIDTH } from '@/constants/layout';
import { Button } from '@/components/ui/Button';
import { useChildInfo } from '@/hooks/useChildInfo';
import { clearAllData, saveChildInfo } from '@/utils/storage';

export default function SettingsScreen() {
  const router = useRouter();
  const { childInfo, refresh } = useChildInfo();
  const [name, setName] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

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
    if (!trimmedName) return;

    const month = parseInt(birthMonth, 10);
    const year = parseInt(birthYear, 10);
    const day = parseInt(birthDay, 10);

    if (!month || !year || !day) return;

    const birthday = new Date(year, month - 1, day);

    setSaving(true);
    try {
      await saveChildInfo({
        name: trimmedName,
        birthday: birthday.toISOString(),
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
      if (window.confirm('This will delete all your data including saved memories. Are you sure?')) {
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
            onPress: () => clearAllData().then(() => router.replace('/onboarding')),
          },
        ]
      );
    }
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
          <Text style={styles.label}>Child's Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor={Colors.textLight}
            maxLength={30}
          />

          <Text style={[styles.label, { marginTop: Spacing.lg }]}>Birthday</Text>
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

          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={saving}
            style={{ marginTop: Spacing.lg }}
          />

          {message ? (
            <Text style={styles.message}>{message}</Text>
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
