import { formatMemoryDate } from '../formatMemoryDate';

describe('formatMemoryDate', () => {
  it('formats valid ISO date string to long date format', () => {
    expect(formatMemoryDate('2025-06-15T12:00:00.000Z')).toMatch(/June 15, 2025/i);
  });

  it('formats valid Date object to long date format', () => {
    expect(formatMemoryDate(new Date(2024, 11, 25))).toBe('December 25, 2024');
  });

  it('returns "Unknown date" for invalid date string', () => {
    expect(formatMemoryDate('invalid-date')).toBe('Unknown date');
  });

  it('returns "Unknown date" for invalid Date object', () => {
    expect(formatMemoryDate(new Date('invalid'))).toBe('Unknown date');
  });
});
