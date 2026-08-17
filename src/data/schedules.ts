export interface WeeklySchedule {
  day: string;
  classes: string[];
}

export const virtualLearningNote =
  'Register at least two (2) weeks before your scheduled class. Zoom test meetings are held during the week between registration and your class start date.';

export const weeklySchedule: WeeklySchedule[] = [
  { day: 'Monday', classes: ['CPR / First Aid Training (in-person skills required)'] },
  { day: 'Tuesday', classes: ['Mental Health Specialty Training'] },
  {
    day: 'Wednesday',
    classes: ['Nurse Delegation — Core', 'Adult Education Class'],
  },
  { day: 'Thursday', classes: ['Nurse Delegation — Focus on Diabetes'] },
  { day: 'Friday', classes: ['Dementia Specialty Training'] },
  { day: 'By appointment', classes: ['Continuing Education'] },
];

export const scheduleNotes = [
  'HCA Core Basic Training is offered online and can start anytime once registration is completed.',
  'Refer to each course page for detailed schedule information.',
];
