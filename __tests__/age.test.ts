import { calculateAge, formatAge, formatAgeShort } from '../utils/age';

describe('calculateAge', () => {
  it('returns 0 years 0 months for a newborn', () => {
    const now = new Date(2026, 1, 13);
    const birthday = new Date(2026, 1, 13);
    const result = calculateAge(birthday, now);
    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.totalMonths).toBe(0);
  });

  it('calculates 6 months correctly', () => {
    const birthday = new Date(2025, 2, 15); // Mar 15
    const now = new Date(2025, 8, 15); // Sep 15
    const result = calculateAge(birthday, now);
    expect(result.years).toBe(0);
    expect(result.months).toBe(6);
    expect(result.totalMonths).toBe(6);
  });

  it('calculates 1 year 3 months correctly', () => {
    const birthday = new Date(2024, 10, 13); // Nov 13
    const now = new Date(2026, 1, 13); // Feb 13
    const result = calculateAge(birthday, now);
    expect(result.years).toBe(1);
    expect(result.months).toBe(3);
    expect(result.totalMonths).toBe(15);
  });

  it('calculates exactly 2 years', () => {
    const birthday = new Date(2024, 1, 13); // Feb 13
    const now = new Date(2026, 1, 13); // Feb 13
    const result = calculateAge(birthday, now);
    expect(result.years).toBe(2);
    expect(result.months).toBe(0);
    expect(result.totalMonths).toBe(24);
  });

  it('calculates 1 month correctly', () => {
    const birthday = new Date(2026, 0, 13); // Jan 13
    const now = new Date(2026, 1, 13); // Feb 13
    const result = calculateAge(birthday, now);
    expect(result.years).toBe(0);
    expect(result.months).toBe(1);
  });

  it('handles mid-month (before birthday day) as incomplete month', () => {
    const birthday = new Date(2025, 0, 20); // Jan 20
    const now = new Date(2025, 1, 13); // Feb 13 (before the 20th)
    const result = calculateAge(birthday, now);
    expect(result.years).toBe(0);
    expect(result.months).toBe(0); // hasn't completed first month
  });

  it('handles mid-month (after birthday day) as complete month', () => {
    const birthday = new Date(2025, 0, 10); // Jan 10
    const now = new Date(2025, 1, 13); // Feb 13 (after the 10th)
    const result = calculateAge(birthday, now);
    expect(result.years).toBe(0);
    expect(result.months).toBe(1);
  });

  it('calculates 11 months (nearly 1 year)', () => {
    const birthday = new Date(2025, 2, 1); // Mar 1
    const now = new Date(2026, 1, 13); // Feb 13
    const result = calculateAge(birthday, now);
    expect(result.years).toBe(0);
    expect(result.months).toBe(11);
  });

  it('calculates 3 years 7 months', () => {
    const birthday = new Date(2022, 6, 1); // Jul 1
    const now = new Date(2026, 1, 13); // Feb 13
    const result = calculateAge(birthday, now);
    expect(result.years).toBe(3);
    expect(result.months).toBe(7);
  });
});

describe('formatAge', () => {
  it('formats newborn', () => {
    expect(formatAge({ years: 0, months: 0, totalMonths: 0 })).toBe('Newborn');
  });

  it('formats months only', () => {
    expect(formatAge({ years: 0, months: 6, totalMonths: 6 })).toBe('6 months');
  });

  it('formats 1 month (singular)', () => {
    expect(formatAge({ years: 0, months: 1, totalMonths: 1 })).toBe('1 month');
  });

  it('formats years only', () => {
    expect(formatAge({ years: 2, months: 0, totalMonths: 24 })).toBe('2 years');
  });

  it('formats 1 year (singular)', () => {
    expect(formatAge({ years: 1, months: 0, totalMonths: 12 })).toBe('1 year');
  });

  it('formats years and months', () => {
    expect(formatAge({ years: 1, months: 3, totalMonths: 15 })).toBe('1 year & 3 months');
  });

  it('formats singular year and singular month', () => {
    expect(formatAge({ years: 1, months: 1, totalMonths: 13 })).toBe('1 year & 1 month');
  });
});

describe('formatAgeShort', () => {
  it('formats newborn', () => {
    expect(formatAgeShort({ years: 0, months: 0, totalMonths: 0 })).toBe('Newborn');
  });

  it('formats months only', () => {
    expect(formatAgeShort({ years: 0, months: 6, totalMonths: 6 })).toBe('6mo');
  });

  it('formats years only', () => {
    expect(formatAgeShort({ years: 2, months: 0, totalMonths: 24 })).toBe('2yr');
  });

  it('formats years and months', () => {
    expect(formatAgeShort({ years: 1, months: 3, totalMonths: 15 })).toBe('1yr 3mo');
  });
});
