export interface AgeResult {
  years: number;
  months: number;
  totalMonths: number;
}

export function calculateAge(birthday: Date, now: Date = new Date()): AgeResult {
  let years = now.getFullYear() - birthday.getFullYear();
  let months = now.getMonth() - birthday.getMonth();

  if (now.getDate() < birthday.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalMonths = years * 12 + months;

  return { years, months, totalMonths };
}

export function formatAge(age: AgeResult): string {
  const { years, months } = age;

  if (years === 0 && months === 0) {
    return 'Newborn';
  }

  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  }

  return parts.join(' & ');
}

export function formatAgeShort(age: AgeResult): string {
  const { years, months } = age;

  if (years === 0 && months === 0) {
    return 'Newborn';
  }

  if (years === 0) {
    return `${months}mo`;
  }

  if (months === 0) {
    return `${years}yr`;
  }

  return `${years}yr ${months}mo`;
}
