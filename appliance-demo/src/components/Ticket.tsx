'use client'

import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import type { Answers, Crack, Problem, Size, Tracking } from '../lib/flow'
import type { Visit } from '../lib/params'
import { track } from '../lib/firebase'

type Step = 'size' | 'problem' | 'tracking' | 'cracks'

const sizeOptions: { id: Size; label: string; hint: string }[] = [
  { id: 'solo', label: 'Just me', hint: 'I run the calls and the repairs' },
  { id: 'small', label: '2 to 5', hint: 'A small team, maybe an office helper' },
  { id: 'large', label: '6 or more', hint: 'Several vans, a manager or dispatcher' },
]

const problemOptions: { id: Problem; label: string; hint: string }[] = [
  { id: 'found', label: 'People can’t find me on Google', hint: 'No website, or one that doesn’t bring calls' },
  { id: 'calls', label: 'I miss calls while I’m on a job', hint: 'They call the next shop instead' },
  { id: 'chaos', label: 'Second trips, wrong parts, messy schedule', hint: 'Too much juggling between jobs' },
  { id: 'payments', label: 'Chasing payments and reviews', hint: 'Invoices late, few Google reviews' },
]

const trackingOptions: { id: Tracking; label: string; hint: string }[] = [
  { id: 'sheets', label: 'Google Sheets or Excel', hint: 'One or more shared spreadsheets' },
  { id: 'paper', label: 'Paper, texts and WhatsApp', hint: 'Notebooks, group chats, sticky notes' },
  { id: 'software', label: 'Software like Jobber or Housecall Pro', hint: 'Plus some sheets on the side' },
  { id: 'none', label: 'Mostly in my head', hint: 'It works until it doesn’t' },
]

const crackOptions: { id: Crack; label: string; hint: string }[] = [
  { id: 'team', label: 'Team', hint: 'Leaves, training, performance, interns' },
  { id: 'inventory', label: 'Inventory', hint: 'Warehouses, vans, stores, lost items' },
  { id: 'paperwork', label: 'Paperwork', hint: 'Forms, reports, approvals' },
  { id: 'support', label: 'Customer complaints', hint: 'Callbacks and follow-ups' },
]

const questions: Record<Step, string> = {
  size: 'How many technicians, counting you?',
  problem: 'What’s costing you the most jobs right now?',
  tracking: 'How do you keep track of jobs, staff and stock today?',
  cracks: 'Where do things fall through the cracks? Pick any.',
}

const fieldLabel: Record<Step, string> = {
  size: 'Team',
  problem: 'Biggest leak',
  tracking: 'Runs on',
  cracks: 'Gaps',
}

export function answerText(step: Step, a: Answers): string | undefined {
  if (step === 'size') return sizeOptions.find((o) => o.id === a.size)?.label
  if (step === 'problem') return problemOptions.find((o) => o.id === a.problem)?.label
  if (step === 'tracking') return trackingOptions.find((o) => o.id === a.tracking)?.label
  if (step === 'cracks') return a.cracks?.length ? a.cracks.map((c) => crackOptions.find((o) => o.id === c)!.label).join(', ') : undefined
}

export function problemLabel(p?: Problem) {
  return problemOptions.find((o) => o.id === p)?.label
}

export function Ticket({ visit, onDone }: { visit: Visit; onDone: (a: Answers) => void }) {
  const [a, setA] = useState<Answers>({ size: visit.size, problem: visit.problem })
  const [picked, setPicked] = useState<Crack[]>([])
  const [pending, setPending] = useState<string>()

  const steps = useMemo<Step[]>(() => {
    const s: Step[] = []
    if (!visit.size) s.push('size')
    if (!visit.problem) s.push('problem')
    s.push('tracking')
    if ((a.size ?? visit.size) === 'large') s.push('cracks')
    return s
  }, [visit.size, visit.problem, a.size])

  const current = steps.find((s) => {
    if (s === 'cracks') return true
    return a[s] === undefined
  })!
  const stepIndex = steps.indexOf(current)

  function answer(next: Answers) {
    const merged = { ...a, ...next }
    setA(merged)
    const remaining = steps.filter((s) => s !== 'cracks' && merged[s] === undefined)
    const needsCracks = merged.size === 'large'
    track('quiz_answer', { step: current, value: String(Object.values(next)[0]) })
    if (remaining.length === 0 && !needsCracks) onDone(merged)
  }

  function finishCracks() {
    const merged = { ...a, cracks: picked }
    track('quiz_answer', { step: 'cracks', value: picked.join(',') || 'none' })
    onDone(merged)
  }

  function back() {
    const prev = steps[stepIndex - 1]
    if (!prev) return
    if (prev === 'cracks') return
    setA({ ...a, [prev]: undefined })
  }

  const options =
    current === 'size' ? sizeOptions : current === 'problem' ? problemOptions : current === 'tracking' ? trackingOptions : crackOptions

  const allFields: Step[] = ['size', 'problem', 'tracking', ...((a.size ?? visit.size) === 'large' ? (['cracks'] as Step[]) : [])]

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="rounded-t-2xl bg-form px-5 py-3 text-white sm:px-7">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[15px] font-bold">Service work order</p>
          <p className="nums text-[13px] text-white/75">
            Question {stepIndex + 1} of {steps.length}
          </p>
        </div>
        <div className="mt-2.5 h-1 rounded-full bg-white/20" aria-hidden>
          <div className="h-1 rounded-full bg-signal transition-all duration-300" style={{ width: `${((stepIndex + (pending ? 1 : 0)) / steps.length) * 100}%` }} />
        </div>
      </div>

      <div className="rounded-b-2xl border border-t-0 border-line bg-card shadow-[0_24px_48px_-28px_rgba(24,49,143,0.45)]">
        {/* Filled-in fields */}
        <dl className="grid grid-cols-1 gap-x-6 border-b border-dashed border-form/30 px-5 py-4 sm:grid-cols-2 sm:px-7">
          <Field label="Business" value={visit.business ?? 'Your repair business'} filled={Boolean(visit.business)} />
          <Field label="Service area" value={visit.city ?? 'Your city'} filled={Boolean(visit.city)} />
          {allFields.map((f) => (
            <Field key={f} label={fieldLabel[f]} value={answerText(f, a)} active={f === current} />
          ))}
        </dl>

        {/* Current question */}
        <div key={current} className="slide-in px-5 pt-5 pb-6 sm:px-7">
          <h2 className="text-[21px] leading-tight font-bold sm:text-[24px]">{questions[current]}</h2>
          <div className="mt-4 grid gap-2.5">
            {options.map((o) => {
              const on = current === 'cracks' ? picked.includes(o.id as Crack) : pending === o.id
              return (
                <button
                  key={o.id}
                  onClick={() => {
                    if (current === 'cracks') {
                      const id = o.id as Crack
                      setPicked(on ? picked.filter((p) => p !== id) : [...picked, id])
                    } else if (!pending) {
                      // Brief confirmation before moving on, so the tap feels registered
                      setPending(o.id)
                      setTimeout(() => {
                        setPending(undefined)
                        answer({ [current]: o.id } as Answers)
                      }, 180)
                    }
                  }}
                  aria-pressed={current === 'cracks' ? on : undefined}
                  className={`group flex min-h-14 w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                    on ? 'border-form bg-form-wash' : 'border-line bg-white hover:border-form'
                  }`}
                >
                  {current === 'cracks' && (
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${on ? 'border-form bg-form text-white' : 'border-line'}`}
                      aria-hidden
                    >
                      {on && <Check size={14} strokeWidth={3} />}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block text-[16px] font-semibold text-ink">{o.label}</span>
                    <span className="block text-[14px] text-steel">{o.hint}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            {stepIndex > 0 && current !== 'cracks' ? (
              <button onClick={back} className="min-h-10 text-[14px] font-semibold text-steel underline-offset-4 hover:text-ink hover:underline">
                Back
              </button>
            ) : (
              <span />
            )}
            {current === 'cracks' && (
              <button
                onClick={finishCracks}
                className="min-h-11 rounded-lg bg-form px-5 text-[15px] font-semibold text-white hover:bg-form-deep"
              >
                {picked.length ? 'Show my plan' : 'Skip and show my plan'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => {
            track('quiz_skipped')
            onDone({ ...a, skipped: true })
          }}
          className="min-h-10 text-[14px] font-semibold text-steel underline underline-offset-4 hover:text-ink"
        >
          Skip the questions and show me everything
        </button>
      </div>
    </div>
  )
}

function Field({ label, value, filled, active }: { label: string; value?: string; filled?: boolean; active?: boolean }) {
  return (
    <div className={`min-h-11 items-baseline gap-3 py-1 ${value || active ? 'flex' : 'hidden sm:flex'}`}>
      <dt className="w-[92px] shrink-0 text-[13px] text-steel">{label}</dt>
      <dd className="min-w-0 flex-1">
        {value && (filled === undefined || filled) ? (
          <span key={value} className="stamp-in inline-block origin-left text-[15px] font-bold text-form-deep">
            {value}
          </span>
        ) : value ? (
          <span className="text-[15px] text-steel/70">{value}</span>
        ) : (
          <span className={`block h-5 border-b-2 ${active ? 'border-signal' : 'border-line'}`} aria-label="Not answered yet" />
        )}
      </dd>
    </div>
  )
}
