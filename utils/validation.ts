export interface BirthdayValidationResult {
  valid: boolean;
  error?: string;
  birthday?: Date;
}

export function validateBirthday(
  birthMonth: string,
  birthDay: string,
  birthYear: string
): BirthdayValidationResult {
  const month = parseInt(birthMonth, 10);
  const year = parseInt(birthYear, 10);
  const day = parseInt(birthDay, 10);
  const now = new Date();

  if (!month || month < 1 || month > 12) {
    return { valid: false, error: 'Invalid month (1-12)' };
  }

  if (!year || year < 2000 || year > now.getFullYear()) {
    return { valid: false, error: `Invalid year (2000-${now.getFullYear()})` };
  }

  if (!day || day < 1 || day > 31) {
    return { valid: false, error: 'Invalid day (1-31)' };
  }

  const birthday = new Date(year, month - 1, day);
  
  // Verify the date didn't overflow (e.g., Feb 30 -> March 2)
  if (birthday.getMonth() !== month - 1 || birthday.getDate() !== day) {
    return { valid: false, error: 'Invalid date for selected month' };
  }
  
  if (birthday > now) {
    return { valid: false, error: "Birthday can't be in the future" };
  }

  return { valid: true, birthday };
}
