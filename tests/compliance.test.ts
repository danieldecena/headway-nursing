import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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

describe('the policies page respects the gate', () => {
  const source = readFileSync(join(__dirname, '../src/pages/policies.astro'), 'utf8');

  it('renders the licence statement only behind a status check', () => {
    // The verbatim statement must never appear as an unconditional literal.
    expect(source).not.toContain('This school is licensed under chapter 28C.10 RCW');
  });

  it('publishes the disclosures that hold under either regime', () => {
    for (const key of ['nonDiscrimination', 'accommodations', 'grievance']) {
      expect(source, `policies.astro does not render compliance.${key}`).toContain(
        `compliance.${key}`,
      );
    }
  });
});

describe('the refund page is driven by the schedule', () => {
  const source = readFileSync(join(__dirname, '../src/pages/refund-policy.astro'), 'utf8');

  it('renders the tiers from data rather than hardcoding them', () => {
    expect(source).toContain('compliance.refund.tiers');
  });

  it('no longer carries the pre-launch placeholder', () => {
    expect(source).not.toContain('Confirm with Janice before launch');
  });

  it('states the cancellation window', () => {
    expect(source).toContain('compliance.refund.cancellationDays');
  });
});
