// ---------------------------------------------------------------
// Contact details and prices — pulled from stellixsoft.com / StellixSoft.
// ---------------------------------------------------------------

export const company = {
  name: 'StellixSoft',
  website: 'https://stellixsoft.com',
  bookingUrl: 'https://calendly.com/stellixsoft/15-minute-meeting',
  email: 'info@stellixsoft.com',
  phone: '(847) 496-9803',
  whatsapp: '', // company US line is the phone above; personal WhatsApp lives on business cards only
  logo: '/stellixsoft-logo.png',
  /** Quote form POST target. Same-origin API on Vercel; override for split dev setups. */
  demoLeadUrl: process.env.NEXT_PUBLIC_DEMO_LEAD_URL?.trim() || '/api/demo-lead',
}

// Starting prices shown on the page. Owners compare everything to
// $59/month software, so clear "from" prices keep them reading.
export const prices = {
  website: { setup: 'from $990', monthly: '$79/mo hosting, SEO and updates' },
  calls: { setup: 'from $300', monthly: 'from $99/mo' },
  payments: { setup: 'from $300', monthly: 'from $49/mo' },
  sheets: { setup: 'from $4,500', monthly: 'from $199/mo support and hosting' },
  ops: { setup: 'from $12,000', monthly: 'scoped per business' },
}

export const industry = {
  label: 'appliance repair',
  jobNoun: 'repair',
}

// Short reassurances shown under the hero and next to the buttons.
export const promises = [
  'Built for appliance repair shops',
  'Fixed quote before any work starts',
  'You own your website, data and code',
]

// What happens after someone books. Shown as three steps near the form.
export const nextSteps = [
  { title: '15-minute call', text: 'You tell us what’s costing you jobs. We ask a few questions, no pitch deck.' },
  { title: 'A written plan in 2 days', text: 'What we’d do first, what it costs, and how long it takes. Yours to keep either way.' },
  { title: 'Live in weeks, not months', text: 'Most shops start with one piece and add the next once it pays for itself.' },
]

// A real client quote, already public on stellixsoft.com.
export const testimonial = {
  quote: 'Back-end stuff for our site: employee forms, fixes, small updates. They usually turn things around fast and ask what we’re trying to solve before jumping in. Saves us headaches.',
  name: 'Jonathan Leibovitch',
  company: 'Doctor Appliance',
}

/** Case study block on the demo page. Keep named false until screenshots / naming are cleared. */
export const caseStudy = {
  named: false,
  name: 'Doctor Appliance',
  screenshots: [] as { src: string; alt: string }[],
}
