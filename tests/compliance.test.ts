import { describe, expect, it } from 'vitest';
import { compliance } from '../src/data/compliance';

describe('licensure gate', () => {
  it('defaults to unconfirmed until Janice confirms the regime', () => {
    expect(compliance.licensure.status).toBe('unconfirmed');
  });

  it('carries no licence statement or number while unconfirmed', () => {
    if (compliance.licensure.status === 'unconfirmed') {
      expect(compliance.licensure.statement).toBeNull();
      expect(compliance.licensure.licenseNumber).toBeNull();
    }
  });
});

describe('statutory refund schedule', () => {
  it('gives five business days to cancel', () => {
    expect(compliance.refund.cancellationDays).toBe(5);
  });

  it('matches the WAC 490-105-130 tiers, in ascending order', () => {
    expect(compliance.refund.tiers.map((t) => [t.throughPercent, t.schoolKeepsPercent])).toEqual([
      [10, 10],
      [25, 25],
      [50, 50],
      [100, 100],
    ]);
  });

  it('caps the retained registration fee at the statutory maximum', () => {
    // WAC 490-105-130: not exceeding 10% of tuition or $100, whichever is less.
    expect(compliance.refund.registrationFee.amount).toBeLessThanOrEqual(100);
  });
});
