import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { faqs } from '../src/data/faqs';
import { scheduleNotes, weeklySchedule } from '../src/data/schedules';
import { initials, testimonials } from '../src/data/testimonials';

describe('faqs', () => {
  it('has non-empty questions and answers', () => {
    expect(faqs.length).toBeGreaterThan(0);
    for (const faq of faqs) {
      expect(faq.question.trim()).not.toBe('');
      expect(faq.answer.trim()).not.toBe('');
    }
  });

  it('has unique questions', () => {
    const questions = faqs.map((f) => f.question);
    expect(new Set(questions).size).toBe(questions.length);
  });
});

describe('weekly schedule', () => {
  it('lists at least one class per entry', () => {
    expect(weeklySchedule.length).toBeGreaterThan(0);
    for (const entry of weeklySchedule) {
      expect(entry.day.trim()).not.toBe('');
      expect(entry.classes.length, entry.day).toBeGreaterThan(0);
      for (const cls of entry.classes) {
        expect(cls.trim(), entry.day).not.toBe('');
      }
    }
  });

  it('has unique days', () => {
    const days = weeklySchedule.map((s) => s.day);
    expect(new Set(days).size).toBe(days.length);
  });

  it('has non-empty schedule notes', () => {
    for (const note of scheduleNotes) {
      expect(note.trim()).not.toBe('');
    }
  });
});

describe('testimonials', () => {
  it('references portraits that exist in public/', () => {
    const publicDir = join(__dirname, '../public');
    for (const person of testimonials) {
      if (!person.photo) continue;
      expect(existsSync(join(publicDir, person.photo)), `${person.photo} missing from public/`).toBe(true);
    }
  });

  it('has a name, role and quote on every entry', () => {
    expect(testimonials.length).toBeGreaterThan(0);
    for (const person of testimonials) {
      expect(person.name.trim()).not.toBe('');
      expect(person.role.trim()).not.toBe('');
      expect(person.quote.trim().length).toBeGreaterThan(40);
    }
  });

  it('builds initials for the no-photo fallback', () => {
    expect(initials('Gordana B.')).toBe('GB');
  });
});
