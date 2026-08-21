import { z } from 'astro/zod';
import raw from './schedules.json';

const weeklyScheduleSchema = z.object({
  day: z.string().min(1),
  classes: z.array(z.string().min(1)).min(1),
});

export type WeeklySchedule = z.infer<typeof weeklyScheduleSchema>;

export const virtualLearningNote =
  'Register at least two (2) weeks before your scheduled class. Zoom test meetings are held during the week between registration and your class start date.';

export const weeklySchedule: WeeklySchedule[] = z
  .array(weeklyScheduleSchema)
  .parse(raw);

export const scheduleNotes = [
  'HCA Core Basic Training is offered online and can start anytime once registration is completed.',
  'Refer to each course page for detailed schedule information.',
];
