// Disclosure facts for the student-facing policy pages.
//
// licensure.status is deliberately 'unconfirmed'. Headway's regulatory regime
// could not be established from public sources: the Workforce Board's licensed-
// schools list renders dynamically, and the live site states no licence number
// or agency. Two regimes are possible and they differ in what must be said —
// RCW 28C.10 / WAC 490-105 (private career school) or WAC 388-112A (DSHS
// long-term-care-worker training entity). Until Janice confirms which, no page
// may assert either. Flipping this flag is the whole switch.
export const compliance = {
  licensure: {
    status: 'unconfirmed' as 'unconfirmed' | 'private-career-school' | 'dshs-only',
    statement: null as string | null,
    licenseNumber: null as string | null,
  },

  // WAC 490-105-130. Percentages are of the program completed; schoolKeeps is
  // the share of tuition the school may retain at that point.
  refund: {
    cancellationDays: 5,
    tiers: [
      { throughPercent: 10, schoolKeepsPercent: 10, label: 'One week, or up to 10% of the program' },
      { throughPercent: 25, schoolKeepsPercent: 25, label: 'More than 10% but less than 25%' },
      { throughPercent: 50, schoolKeepsPercent: 50, label: '25% through 50%' },
      { throughPercent: 100, schoolKeepsPercent: 100, label: 'More than 50%' },
    ],
    registrationFee: {
      amount: 50,
      refundableAfterCancellationWindow: false,
    },
  },

  grievance: {
    steps: [
      'Raise the concern with your instructor first. Most issues are resolved at this step.',
      'If it is unresolved, put it in writing to the Program Director, Janice Angle, RN, by email or post to the office address.',
      'The Program Director responds in writing within ten business days.',
    ],
    // Populated only when licensure.status names a regulator with a complaints route.
    agency: null as {
      name: string;
      address: string;
      phone: string;
      web: string;
      email: string;
    } | null,
  },

  nonDiscrimination:
    'Headway Nursing Services admits students of any race, color, national or ethnic origin, religion, sex, sexual orientation, gender identity, age, veteran status, or disability, and does not discriminate in the administration of its admissions or training policies.',

  accommodations:
    'If you need an accommodation to participate in a class, contact the office before your start date so arrangements can be made. Requests are handled confidentially.',
} as const;
