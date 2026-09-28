'use client'

import type { ReactNode } from 'react'
import { useSeen } from '@/lib/useSeen'
import { Check, Plus } from 'lucide-react'
import { SampleBadge } from './ui'

export function Section({
  id,
  index,
  total,
  bridge,
  eyebrowNote,
  title,
  problem,
  points,
  price,
  demo,
  wideDemo = false,
  footer,
  business,
  wanted = false,
  onWant,
}: {
  id: string
  index: number
  total: number
  bridge?: string
  eyebrowNote?: string
  title: string
  problem: string
  points: string[]
  price?: { setup: string; monthly: string }
  demo: ReactNode
  wideDemo?: boolean
  footer?: ReactNode
  business?: string
  wanted?: boolean
  onWant?: () => void
}) {
  const ref = useSeen<HTMLElement>(id, { business })
  return (
    <section id={id} ref={ref} className="scroll-mt-20 border-t border-line py-14 sm:py-20">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        {bridge && <p className="mb-8 max-w-[62ch] text-[15px] text-steel">{bridge}</p>}

        <div className={wideDemo ? '' : 'grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16'}>
          <div className={wideDemo ? 'grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16' : ''}>
            <div>
              <p className="nums text-[14px] font-semibold text-form">
                Step {index + 1} of {total}
                {eyebrowNote ? <span className="font-normal text-steel">, {eyebrowNote}</span> : null}
              </p>
              <h2 className="display mt-2 max-w-[20ch] text-[30px] sm:text-[40px]">{title}</h2>
              <p className="mt-4 max-w-[58ch] text-[17px] text-ink/85">{problem}</p>
            </div>
            <div className={wideDemo ? 'lg:pt-9' : 'mt-8'}>
              <ul className="grid max-w-[60ch] gap-3">
                {points.map((p) => (
                  <li key={p} className="flex gap-3 text-[16px]">
                    <span className="mt-[9px] h-2 w-2 shrink-0 rotate-45 bg-signal" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-5">
                {price && (
                  <p className="text-[15px]">
                    <span className="font-bold">{price.setup}</span>
                    <span className="text-steel"> setup, then {price.monthly}</span>
                  </p>
                )}
                {onWant && (
                  <button
                    onClick={onWant}
                    aria-pressed={wanted}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-lg border-2 px-4 text-[14px] font-semibold transition-colors ${
                      wanted ? 'border-ok bg-ok-wash text-ok' : 'border-ink bg-white text-ink hover:bg-ink hover:text-white'
                    }`}
                  >
                    {wanted ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                    {wanted ? 'Added to your quote' : 'Add to my quote'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={wideDemo ? 'mt-10' : ''}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[14px] font-semibold text-steel">Try it</p>
              <SampleBadge />
            </div>
            {demo}
          </div>
        </div>
        {footer}
      </div>
    </section>
  )
}
