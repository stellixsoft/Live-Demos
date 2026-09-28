export type Size = 'solo' | 'small' | 'large'
export type Problem = 'found' | 'calls' | 'chaos' | 'payments'
export type Tracking = 'sheets' | 'paper' | 'software' | 'none'
export type Crack = 'team' | 'inventory' | 'paperwork' | 'support' | 'training'
export type SectionId = 'website' | 'calls' | 'payments' | 'sheets' | 'ops'

export interface Answers {
  size?: Size
  problem?: Problem
  tracking?: Tracking
  cracks?: Crack[]
  skipped?: boolean
}

const baseOrder: Record<Size, SectionId[]> = {
  solo: ['website', 'calls', 'payments', 'sheets', 'ops'],
  small: ['website', 'calls', 'sheets', 'payments', 'ops'],
  large: ['ops', 'sheets', 'calls', 'payments', 'website'],
}

function primaryFor(problem: Problem, size: Size): SectionId {
  switch (problem) {
    case 'found':
      return 'website'
    case 'calls':
      return 'calls'
    case 'payments':
      return 'payments'
    case 'chaos':
      return size === 'large' ? 'ops' : 'sheets'
  }
}

/** Order the solution sections so his top problem comes first. */
export function orderSections(a: Answers): SectionId[] {
  const size = a.size ?? 'small'
  let order = [...baseOrder[size]]
  if (a.skipped || !a.problem) return order

  const primary = primaryFor(a.problem, size)
  order = [primary, ...order.filter((s) => s !== primary)]
  if (!order.includes(primary)) order.unshift(primary)

  // People running on sheets or paper see the sheets-to-software story second.
  if ((a.tracking === 'sheets' || a.tracking === 'paper') && order[0] !== 'sheets') {
    order = [order[0], 'sheets', ...order.slice(1).filter((s) => s !== 'sheets')]
  }
  return order
}

export const sectionMeta: Record<SectionId, { nav: string; outcome: string; bridge: string }> = {
  website: {
    outcome: 'More calls and bookings from Google',
    nav: 'Get found',
    bridge: 'Next, make sure people who search for a repair near them find you, and can book without calling.',
  },
  calls: {
    outcome: 'Missed calls turned into booked jobs',
    nav: 'Missed calls',
    bridge: 'Next, the jobs that slip away while you are behind a dryer and cannot pick up.',
  },
  payments: {
    outcome: 'Paid on the spot, more 5-star reviews',
    nav: 'Paid and reviewed',
    bridge: 'Next, getting paid on the spot and turning every good job into a Google review.',
  },
  sheets: {
    outcome: 'Your sheets become one app with roles and reminders',
    nav: 'Sheets to software',
    bridge: 'Next, moving the spreadsheets and WhatsApp groups into one place your whole team uses.',
  },
  ops: {
    outcome: 'Team, stock, forms and complaints in one dashboard',
    nav: 'Operations hub',
    bridge: 'Next, running technicians, stock, forms and complaints from one dashboard.',
  },
}
