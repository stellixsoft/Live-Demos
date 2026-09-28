// Invented trainee progress for the Forms and Team demos.

export interface SkillRating {
  name: string
  last: number
  current: number
}

export interface WeekPoint {
  label: string
  workPct: number
  avgRating: number
}

export interface Trainee {
  id: string
  name: string
  store: string
  mentor: string
  weeks: WeekPoint[]
  skills: SkillRating[]
  readiness: { ready: boolean; detail: string }
}

export const trainees: Trainee[] = [
  {
    id: 'tr1',
    name: 'Kevin Lam',
    store: 'Riverside',
    mentor: 'Marcus Reed',
    weeks: [
      { label: 'W1', workPct: 28, avgRating: 3.1 },
      { label: 'W2', workPct: 34, avgRating: 3.4 },
      { label: 'W3', workPct: 42, avgRating: 3.6 },
      { label: 'W4', workPct: 48, avgRating: 3.8 },
      { label: 'W5', workPct: 52, avgRating: 3.9 },
      { label: 'W6', workPct: 55, avgRating: 3.5 },
    ],
    skills: [
      { name: 'Punctuality', last: 5, current: 5 },
      { name: 'Customer communication', last: 4, current: 4 },
      { name: 'Diagnostics', last: 3, current: 4 },
      { name: 'Refrigeration (sealed system)', last: 4, current: 2 },
      { name: 'Parts from truck stock', last: 4, current: 4 },
      { name: 'Safety and PPE', last: 5, current: 5 },
    ],
    readiness: { ready: false, detail: 'Ready for solo calls: not yet, 1 skill below 4' },
  },
  {
    id: 'tr2',
    name: 'Priya Nair',
    store: 'Oak Hill',
    mentor: 'Dana Ortiz',
    weeks: [
      { label: 'W1', workPct: 20, avgRating: 3.0 },
      { label: 'W2', workPct: 26, avgRating: 3.3 },
      { label: 'W3', workPct: 32, avgRating: 3.5 },
      { label: 'W4', workPct: 40, avgRating: 3.8 },
      { label: 'W5', workPct: 45, avgRating: 4.0 },
      { label: 'W6', workPct: 50, avgRating: 4.2 },
    ],
    skills: [
      { name: 'Punctuality', last: 5, current: 5 },
      { name: 'Customer communication', last: 4, current: 5 },
      { name: 'Diagnostics', last: 3, current: 4 },
      { name: 'Laundry and dryers', last: 4, current: 4 },
      { name: 'Parts from truck stock', last: 3, current: 4 },
      { name: 'Safety and PPE', last: 5, current: 5 },
    ],
    readiness: { ready: false, detail: 'Ready for solo calls: almost, 2 more ride-alongs' },
  },
]

export const ratingSkills = [
  'Punctuality',
  'Customer communication',
  'Diagnostics',
  'Refrigeration (sealed system)',
  'Parts from truck stock',
  'Safety and PPE',
] as const

/** Scripted starting ratings for the weekly report demo (last week faintly shown). */
export const weeklyLastScores: Record<(typeof ratingSkills)[number], number> = {
  Punctuality: 5,
  'Customer communication': 4,
  Diagnostics: 3,
  'Refrigeration (sealed system)': 4,
  'Parts from truck stock': 4,
  'Safety and PPE': 5,
}

export const otherForms = [
  {
    name: 'Tech Weekly Van Report',
    before: 'A checklist filled in and filed',
    after: 'One tap for “all good”, photos only for problems; bad brakes or tires flag the van and create a repair task',
  },
  {
    name: 'Technician Tool Self Audit',
    before: 'A list checked by hand',
    after: 'Each technician’s assigned tools; missing ones go to lost items and a replacement request',
  },
  {
    name: 'Store Walkthrough Checklist',
    before: 'A checklist per visit',
    after: 'A photo checklist with a score per store over time; failed items become tasks for that store’s manager',
  },
  {
    name: 'Accident Report',
    before: 'A form filled in days later',
    after: 'A guided phone flow on the spot with time, location and photos; the owner is alerted and an insurance-ready PDF is made',
  },
  {
    name: 'Meeting Minutes',
    before: 'Notes nobody reopens',
    after: 'Attendance by tap; every action item becomes a task with an owner and a due date',
  },
  {
    name: 'Discipline Notice',
    before: 'Paper in a folder',
    after: 'Private to managers, acknowledged by e-signature, filed in the employee record',
  },
] as const

export const beforeSubmissions = [
  { date: 'Sep 26', store: 'Riverside', who: 'Marcus Reed', type: 'Training Report Daily' },
  { date: 'Sep 26', store: 'Oak Hill', who: 'Dana Ortiz', type: 'Trainer Weekly Report' },
  { date: 'Sep 25', store: 'Midtown', who: 'Marcus Reed', type: 'Training Report Daily' },
  { date: 'Sep 25', store: 'Lakeview', who: 'Alex Chen', type: 'Training Report Daily' },
  { date: 'Sep 24', store: 'Riverside', who: 'Marcus Reed', type: 'Training Report Daily' },
  { date: 'Sep 24', store: 'Oak Hill', who: 'Dana Ortiz', type: 'Training Report Daily' },
] as const
