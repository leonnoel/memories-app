import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize } from '@/constants/typography';
import { Spacing, BorderRadius } from '@/constants/layout';
import { MemoryEntry } from '@/utils/storage';
import { AgeResult, formatAge } from '@/utils/age';

interface MilestoneReminderProps {
  childName: string;
  age: AgeResult;
  memories: MemoryEntry[];
}

export function MilestoneReminder({ childName, age, memories }: MilestoneReminderProps) {
  // Check if there's a memory for this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const hasThisMonthMemory = memories.some((m) => {
    const memDate = new Date(m.date);
    return memDate.getMonth() === currentMonth && memDate.getFullYear() === currentYear;
  });

  if (hasThisMonthMemory) return null;

  const ageText = formatAge(age);
  const isNewborn = ageText === 'Newborn';

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📸</Text>
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {isNewborn ? `${childName} is a Newborn!` : `${childName} is ${ageText} old!`}
        </Text>
        <Text style={styles.subtitle}>
          Time to capture this month's special moment
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  icon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textLight,
    marginTop: 2,
  },
});
