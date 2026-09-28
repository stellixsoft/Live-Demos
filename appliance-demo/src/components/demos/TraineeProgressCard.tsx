'use client'

import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { Pill } from '../ui'
import type { Trainee } from '@/data/training'

export function TraineeProgressCard({ trainee, highlightDrop = false }: { trainee: Trainee; highlightDrop?: boolean }) {
  const latest = trainee.weeks[trainee.weeks.length - 1]
  return (
    <div className="rounded-lg border border-line bg-white p-3 sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[15px] font-bold">{trainee.name}</p>
          <p className="text-[12px] text-steel">
            {trainee.store} · mentored by {trainee.mentor}
          </p>
        </div>
        <Pill tone={trainee.readiness.ready ? 'ok' : 'signal'}>{trainee.readiness.ready ? 'Solo ready' : 'Not solo ready'}</Pill>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-md bg-paper px-2.5 py-2">
          <p className="text-[11px] text-steel">Trainee work %</p>
          <p className="nums text-[18px] font-bold">{latest.workPct}%</p>
        </div>
        <div className="rounded-md bg-paper px-2.5 py-2">
          <p className="text-[11px] text-steel">Avg rating</p>
          <p className="nums text-[18px] font-bold">{latest.avgRating.toFixed(1)}</p>
        </div>
      </div>

      <ProgressChart weeks={trainee.weeks} />

      <ul className="mt-3 grid gap-1">
        {trainee.skills.map((s) => {
          const delta = s.current - s.last
          const drop = highlightDrop && delta < 0
          return (
            <li
              key={s.name}
              className={`flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[13px] ${drop ? 'bg-alert-wash' : 'bg-paper'}`}
            >
              <span className="min-w-0 truncate">{s.name}</span>
              <span className="flex shrink-0 items-center gap-1.5">
                <span className="nums text-[12px] text-steel/60">{s.last}</span>
                <span className={`nums font-bold ${drop ? 'text-alert' : ''}`}>{s.current}</span>
                {delta > 0 ? (
                  <ArrowUp size={13} className="text-ok" aria-label="Up" />
                ) : delta < 0 ? (
                  <ArrowDown size={13} className="text-alert" aria-label="Down" />
                ) : (
                  <Minus size={13} className="text-steel/40" aria-hidden />
                )}
              </span>
            </li>
          )
        })}
      </ul>

      <p className={`mt-3 text-[13px] font-semibold ${trainee.readiness.ready ? 'text-ok' : 'text-ink'}`}>{trainee.readiness.detail}</p>
    </div>
  )
}

function ProgressChart({ weeks }: { weeks: Trainee['weeks'] }) {
  const w = 280
  const h = 72
  const pad = 6
  const maxWork = 100
  const maxRating = 5

  const workPts = weeks.map((p, i) => {
    const x = pad + (i / (weeks.length - 1)) * (w - pad * 2)
    const y = h - pad - (p.workPct / maxWork) * (h - pad * 2)
    return `${x},${y}`
  })
  const ratingPts = weeks.map((p, i) => {
    const x = pad + (i / (weeks.length - 1)) * (w - pad * 2)
    const y = h - pad - (p.avgRating / maxRating) * (h - pad * 2)
    return `${x},${y}`
  })

  return (
    <div className="mt-3">
      <p className="mb-1 text-[11px] font-semibold text-steel">6 weeks: work % and average rating</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-16 w-full" role="img" aria-label="Trainee progress over six weeks">
        <polyline fill="none" stroke="var(--color-form)" strokeWidth="2" points={workPts.join(' ')} />
        <polyline fill="none" stroke="var(--color-signal)" strokeWidth="2" strokeDasharray="4 3" points={ratingPts.join(' ')} />
        {weeks.map((p, i) => {
          const x = pad + (i / (weeks.length - 1)) * (w - pad * 2)
          return (
            <text key={p.label} x={x} y={h - 1} textAnchor="middle" className="fill-steel" style={{ fontSize: 9 }}>
              {p.label}
            </text>
          )
        })}
      </svg>
      <div className="mt-1 flex gap-3 text-[11px] text-steel">
        <span className="inline-flex items-center gap-1">
          <span className="h-0.5 w-3 bg-form" aria-hidden /> Work %
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-0.5 w-3 border-t-2 border-dashed border-signal" aria-hidden /> Avg rating
        </span>
      </div>
    </div>
  )
}
