// All demo data is invented and labelled "Sample data" on screen.

export interface Tech {
  id: string
  name: string
  role: 'Senior technician' | 'Technician' | 'Intern'
  skills: string[]
  jobsWeek: number
  firstFix: number // percent
  callbacks: number
  rating: number
  revenueWeek: number
  van: string
  status: 'On a job' | 'Driving' | 'Available' | 'On leave'
  training: { name: string; done: boolean; due?: string }[]
  feedback: { from: string; note: string }[]
}

export const techs: Tech[] = [
  {
    id: 't1',
    name: 'Marcus Reed',
    role: 'Senior technician',
    skills: ['Refrigeration', 'Sealed system', 'Samsung', 'LG'],
    jobsWeek: 23,
    firstFix: 88,
    callbacks: 1,
    rating: 4.9,
    revenueWeek: 6840,
    van: 'Van 2',
    status: 'On a job',
    training: [
      { name: 'EPA 608 Universal', done: true },
      { name: 'Samsung ice maker update', done: true },
      { name: 'Induction cooktops', done: false, due: 'Oct 14' },
    ],
    feedback: [
      { from: 'Manager', note: 'Carries the whole fridge queue. Great at explaining repair vs replace to customers.' },
      { from: 'Peer', note: 'Always helps the interns when he is nearby.' },
    ],
  },
  {
    id: 't2',
    name: 'Dana Ortiz',
    role: 'Technician',
    skills: ['Laundry', 'Dishwashers', 'Whirlpool', 'GE'],
    jobsWeek: 19,
    firstFix: 81,
    callbacks: 2,
    rating: 4.8,
    revenueWeek: 4910,
    van: 'Van 4',
    status: 'Driving',
    training: [
      { name: 'Whirlpool front-load diagnostics', done: true },
      { name: 'Customer upsell basics', done: false, due: 'Oct 3' },
    ],
    feedback: [{ from: 'Customer survey', note: 'Mentioned by name in 6 reviews this month.' }],
  },
  {
    id: 't3',
    name: 'Kevin Lam',
    role: 'Technician',
    skills: ['Ranges', 'Ovens', 'Gas', 'Bosch'],
    jobsWeek: 15,
    firstFix: 69,
    callbacks: 4,
    rating: 4.5,
    revenueWeek: 3620,
    van: 'Van 1',
    status: 'Available',
    training: [
      { name: 'Gas safety refresher', done: false, due: 'Overdue' },
      { name: 'Bosch control boards', done: true },
    ],
    feedback: [{ from: 'Manager', note: 'Second trips are mostly wrong parts. Pair with Marcus on pre-visit parts checks.' }],
  },
  {
    id: 't4',
    name: 'Priya Nair',
    role: 'Intern',
    skills: ['Laundry', 'Microwaves'],
    jobsWeek: 8,
    firstFix: 74,
    callbacks: 1,
    rating: 4.7,
    revenueWeek: 1280,
    van: 'Rides with Van 4',
    status: 'On leave',
    training: [
      { name: 'Electrical safety basics', done: true },
      { name: 'Ride-alongs (12 of 20)', done: false, due: 'Nov 1' },
    ],
    feedback: [{ from: 'Mentor', note: 'Ready to take simple dryer calls alone after 5 more ride-alongs.' }],
  },
]

export interface LeaveRequest {
  id: string
  who: string
  dates: string
  reason: string
}

export const leaveRequests: LeaveRequest[] = [
  { id: 'l1', who: 'Dana Ortiz', dates: 'Oct 9 to Oct 10', reason: 'Family event' },
  { id: 'l2', who: 'Kevin Lam', dates: 'Oct 21', reason: 'Medical appointment' },
]

export interface Location {
  id: string
  name: string
  kind: 'Warehouse' | 'Store' | 'Van'
}

export const locations: Location[] = [
  { id: 'w1', name: 'Main warehouse', kind: 'Warehouse' },
  { id: 'w2', name: 'North storage unit', kind: 'Warehouse' },
  { id: 's1', name: 'Eastside store', kind: 'Store' },
  { id: 'v2', name: 'Van 2', kind: 'Van' },
  { id: 'v4', name: 'Van 4', kind: 'Van' },
]

export interface Part {
  sku: string
  name: string
  fits: string
  min: number
  stock: Record<string, number>
}

export const parts: Part[] = [
  { sku: 'DA97-15217D', name: 'Ice maker assembly', fits: 'Samsung French door', min: 3, stock: { w1: 4, w2: 0, s1: 1, v2: 1, v4: 0 } },
  { sku: 'W10712395', name: 'Door gasket kit', fits: 'Whirlpool front-load washer', min: 2, stock: { w1: 1, w2: 2, s1: 0, v2: 0, v4: 1 } },
  { sku: 'WE11X10018', name: 'Drive belt', fits: 'GE dryers', min: 6, stock: { w1: 9, w2: 3, s1: 2, v2: 2, v4: 3 } },
  { sku: 'W10310240', name: 'Thermal fuse', fits: 'Whirlpool dryers', min: 10, stock: { w1: 3, w2: 0, s1: 2, v2: 1, v4: 2 } },
  { sku: '00755078', name: 'Oven igniter', fits: 'Bosch gas ranges', min: 2, stock: { w1: 2, w2: 1, s1: 0, v2: 0, v4: 0 } },
  { sku: 'EBR73093609', name: 'Main control board', fits: 'LG refrigerators', min: 1, stock: { w1: 0, w2: 1, s1: 0, v2: 0, v4: 0 } },
]

export const lostItems = [
  { item: 'Multimeter (Fluke 117)', who: 'Kevin Lam', when: 'Sep 24', status: 'Reported lost' },
  { item: 'Refrigerant gauge set', who: 'Van 4', when: 'Sep 19', status: 'Found at job site' },
  { item: 'Ice maker assembly x1', who: 'Van 2', when: 'Sep 17', status: 'Stock mismatch' },
]

export const vehicles = [
  { name: 'Van 1', driver: 'Kevin Lam', miles: '82,410', next: 'Oil change in 340 mi', flag: false },
  { name: 'Van 2', driver: 'Marcus Reed', miles: '61,025', next: 'Registration due Oct 30', flag: false },
  { name: 'Van 4', driver: 'Dana Ortiz', miles: '104,880', next: 'Brake check overdue', flag: true },
]

export interface Ticket {
  id: string
  customer: string
  issue: string
  age: string
  status: 'New' | 'Assigned' | 'Waiting on part' | 'Resolved'
  owner?: string
}

export const tickets: Ticket[] = [
  { id: '#1042', customer: 'L. Brooks', issue: 'Fridge still warm after repair yesterday', age: '2h', status: 'New' },
  { id: '#1039', customer: 'R. Patel', issue: 'Wants invoice resent for home warranty claim', age: '5h', status: 'Assigned', owner: 'Office' },
  { id: '#1035', customer: 'M. Chen', issue: 'Dryer part delayed, asking for new date', age: '1d', status: 'Waiting on part', owner: 'Dana Ortiz' },
  { id: '#1031', customer: 'J. Alvarez', issue: 'Technician left mud on floor', age: '2d', status: 'Resolved', owner: 'Owner' },
]

export interface Job {
  time: string
  customer: string
  appliance: string
  area: string
  status: 'Done' | 'In progress' | 'Next' | 'Needs part'
  amount?: number
}

export const todaysJobs: Job[] = [
  { time: '8:30', customer: 'Brooks', appliance: 'Samsung fridge, not cooling', area: 'Oak Hill', status: 'Done', amount: 389 },
  { time: '10:00', customer: 'Nguyen', appliance: 'Whirlpool washer, will not drain', area: 'Midtown', status: 'Done', amount: 215 },
  { time: '11:45', customer: 'Garcia', appliance: 'GE dryer, no heat', area: 'Riverside', status: 'In progress' },
  { time: '1:30', customer: 'Okafor', appliance: 'Bosch dishwasher, E24 error', area: 'Westgate', status: 'Next' },
  { time: '3:15', customer: 'Walsh', appliance: 'LG fridge, ice maker', area: 'Oak Hill', status: 'Needs part' },
]
