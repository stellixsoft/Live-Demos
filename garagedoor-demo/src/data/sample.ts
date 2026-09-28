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
    skills: ['Torsion springs', 'Openers', 'Commercial doors', 'LiftMaster'],
    jobsWeek: 26,
    firstFix: 91,
    callbacks: 1,
    rating: 4.9,
    revenueWeek: 9840,
    van: 'Van 2',
    status: 'On a job',
    training: [
      { name: 'Spring safety and winding', done: true },
      { name: 'LiftMaster smart openers', done: true },
      { name: 'Commercial rolling steel doors', done: false, due: 'Oct 14' },
    ],
    feedback: [
      { from: 'Manager', note: 'Highest average ticket on the team. Explains options without pushing.' },
      { from: 'Peer', note: 'Always takes the new guys on tricky spring jobs.' },
    ],
  },
  {
    id: 't2',
    name: 'Dana Ortiz',
    role: 'Technician',
    skills: ['Openers', 'Off-track repairs', 'Genie', 'Chamberlain'],
    jobsWeek: 21,
    firstFix: 84,
    callbacks: 2,
    rating: 4.8,
    revenueWeek: 6120,
    van: 'Van 4',
    status: 'Driving',
    training: [
      { name: 'Spring safety and winding', done: true },
      { name: 'Good, better, best options', done: false, due: 'Oct 3' },
    ],
    feedback: [{ from: 'Customer survey', note: 'Mentioned by name in 7 reviews this month.' }],
  },
  {
    id: 't3',
    name: 'Kevin Lam',
    role: 'Technician',
    skills: ['Springs', 'Cables', 'Residential doors'],
    jobsWeek: 17,
    firstFix: 68,
    callbacks: 4,
    rating: 4.5,
    revenueWeek: 4380,
    van: 'Van 1',
    status: 'Available',
    training: [
      { name: 'Spring sizing and measuring', done: false, due: 'Overdue' },
      { name: 'Spring safety and winding', done: true },
    ],
    feedback: [{ from: 'Manager', note: 'Second trips are mostly wrong spring sizes. Pair with Marcus on measuring.' }],
  },
  {
    id: 't4',
    name: 'Priya Nair',
    role: 'Intern',
    skills: ['Install helper', 'Openers'],
    jobsWeek: 9,
    firstFix: 74,
    callbacks: 1,
    rating: 4.7,
    revenueWeek: 1540,
    van: 'Install crew 2',
    status: 'On leave',
    training: [
      { name: 'Ladder and site safety', done: true },
      { name: 'Door installs assisted (12 of 20)', done: false, due: 'Nov 1' },
    ],
    feedback: [{ from: 'Crew lead', note: 'Ready to handle opener installs alone after 5 more installs.' }],
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
  { id: 's1', name: 'Showroom', kind: 'Store' },
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
  { sku: 'TS-250-2-30', name: 'Torsion spring 0.250 x 2" x 30"', fits: 'Most 7 ft double doors', min: 6, stock: { w1: 4, w2: 0, s1: 1, v2: 1, v4: 0 } },
  { sku: 'TS-243-2-28', name: 'Torsion spring 0.243 x 2" x 28"', fits: 'Lighter double doors', min: 6, stock: { w1: 9, w2: 3, s1: 2, v2: 2, v4: 3 } },
  { sku: 'LM-87504', name: 'LiftMaster belt drive opener', fits: 'Residential, Wi-Fi', min: 3, stock: { w1: 2, w2: 1, s1: 1, v2: 0, v4: 0 } },
  { sku: 'RL-NYL-10', name: 'Nylon rollers, pack of 10', fits: 'Standard 2" track', min: 10, stock: { w1: 14, w2: 4, s1: 2, v2: 3, v4: 2 } },
  { sku: 'CB-7FT', name: 'Lift cables, pair', fits: '7 ft doors', min: 8, stock: { w1: 3, w2: 0, s1: 0, v2: 1, v4: 1 } },
  { sku: 'SEAL-16', name: 'Bottom weather seal, 16 ft', fits: 'Double doors', min: 4, stock: { w1: 0, w2: 2, s1: 0, v2: 0, v4: 0 } },
]

export const lostItems = [
  { item: 'Winding bars, pair', who: 'Kevin Lam', when: 'Sep 24', status: 'Reported lost' },
  { item: 'Opener remotes x3', who: 'Van 4', when: 'Sep 19', status: 'Found at job site' },
  { item: 'Torsion spring 0.250 x1', who: 'Van 2', when: 'Sep 17', status: 'Stock mismatch' },
]

export const vehicles = [
  { name: 'Van 1', driver: 'Kevin Lam', miles: '82,410', next: 'Oil change in 340 mi', flag: false },
  { name: 'Van 2', driver: 'Marcus Reed', miles: '61,025', next: 'Registration due Oct 30', flag: false },
  { name: 'Install truck', driver: 'Crew 2', miles: '104,880', next: 'Ladder rack inspection overdue', flag: true },
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
  { id: '#1042', customer: 'L. Brooks', issue: 'Door noisy and jerky after spring repair yesterday', age: '2h', status: 'New' },
  { id: '#1039', customer: 'R. Patel', issue: 'Wants the warranty paperwork for the new opener', age: '5h', status: 'Assigned', owner: 'Office' },
  { id: '#1035', customer: 'M. Chen', issue: 'New door delivery delayed, asking for install date', age: '1d', status: 'Waiting on part', owner: 'Dana Ortiz' },
  { id: '#1031', customer: 'J. Alvarez', issue: 'Crew left packaging in the driveway', age: '2d', status: 'Resolved', owner: 'Owner' },
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
  { time: '8:00', customer: 'Brooks', appliance: 'Broken torsion spring, car inside', area: 'Oak Hill', status: 'Done', amount: 417 },
  { time: '9:45', customer: 'Nguyen', appliance: 'LiftMaster opener install', area: 'Midtown', status: 'Done', amount: 612 },
  { time: '11:30', customer: 'Garcia', appliance: 'Measure for new 16x7 door', area: 'Riverside', status: 'In progress' },
  { time: '1:15', customer: 'Okafor', appliance: 'Door off track, bent panel', area: 'Westgate', status: 'Next' },
  { time: '3:00', customer: 'Walsh', appliance: 'Cables snapped, needs 7 ft pair', area: 'Oak Hill', status: 'Needs part' },
]
