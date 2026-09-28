import type { Problem, Size } from './flow'

export interface Visit {
  business?: string
  city?: string
  owner?: string
  size?: Size
  problem?: Problem
  skip: boolean
  ref?: string
}

const sizes: Size[] = ['solo', 'small', 'large']
const problems: Problem[] = ['found', 'calls', 'chaos', 'payments']

function titleCase(slug: string) {
  return slug
    .replace(/[-_+]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((w) => (w.length <= 2 && w !== 'of' ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(' ')
    .replace(/\bAnd\b/g, '&')
}

function clean(v: string | null, max = 60) {
  if (!v) return undefined
  const t = v.replace(/[<>]/g, '').trim().slice(0, max)
  return t || undefined
}

/**
 * Personalize from the link, e.g.
 *   ?b=joes-garage-doors&city=dallas&owner=joe&size=small
 * size: solo | small | large   problem: found | calls | chaos | payments
 * skip=1 jumps straight to everything.
 */
export function readVisit(search = window.location.search): Visit {
  const p = new URLSearchParams(search)
  const b = clean(p.get('b') ?? p.get('business'))
  const city = clean(p.get('city'))
  const owner = clean(p.get('owner'), 30)
  const size = p.get('size') as Size | null
  const problem = p.get('problem') as Problem | null
  return {
    business: b ? (b.includes(' ') ? b : titleCase(b)) : undefined,
    city: city ? titleCase(city) : undefined,
    owner: owner ? titleCase(owner) : undefined,
    size: size && sizes.includes(size) ? size : undefined,
    problem: problem && problems.includes(problem) ? problem : undefined,
    skip: p.get('skip') === '1',
    ref: clean(p.get('ref'), 40),
  }
}
