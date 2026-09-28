'use client'

import { useEffect, useState } from 'react'
import { Check, Mic, RotateCcw } from 'lucide-react'
import { Phone, Pill } from '../ui'
import { track } from '@/lib/firebase'
import { ratingSkills, trainees, weeklyLastScores } from '@/data/training'
import { TraineeProgressCard } from './TraineeProgressCard'

type Step = 1 | 2 | 3

const VOICE_NOTE = 'Found a failed evaporator fan motor, trainee replaced it from truck stock'

const scriptedRatings: Record<(typeof ratingSkills)[number], number> = {
  Punctuality: 5,
  'Customer communication': 4,
  Diagnostics: 4,
  'Refrigeration (sealed system)': 2,
  'Parts from truck stock': 4,
  'Safety and PPE': 5,
}

export function FormsAfter({ onReplayReady }: { onReplayReady?: () => void }) {
  const [step, setStep] = useState<Step>(1)
  const [trainerPct, setTrainerPct] = useState(55)
  const [voiceOn, setVoiceOn] = useState(false)
  const [ratings, setRatings] = useState<Partial<Record<(typeof ratingSkills)[number], number>>>({})
  const [reveal, setReveal] = useState(0)

  useEffect(() => {
    if (step !== 3) return
    setReveal(0)
    const t1 = setTimeout(() => setReveal(1), 400)
    const t2 = setTimeout(() => setReveal(2), 1100)
    const t3 = setTimeout(() => setReveal(3), 1800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [step])

  function playAgain() {
    setStep(1)
    setTrainerPct(55)
    setVoiceOn(false)
    setRatings({})
    setReveal(0)
    onReplayReady?.()
    track('demo_interact', { demo: 'ops', action: 'forms_replay' })
  }

  return (
    <div className="slide-in">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="nums text-[13px] font-semibold text-steel">
          Step {step} of 3
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {([1, 2, 3] as const).map((n) => (
            <span key={n} className={`h-1.5 w-6 rounded-full ${n <= step ? 'bg-form' : 'bg-line'}`} />
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,330px)_1fr] lg:items-start">
        <div className={step === 3 ? 'hidden lg:block lg:opacity-40' : ''}>
          {step === 1 && (
            <Step1Phone
              trainerPct={trainerPct}
              onTrainerPct={setTrainerPct}
              voiceOn={voiceOn}
              onVoice={() => {
                setVoiceOn(true)
                track('demo_interact', { demo: 'ops', action: 'forms_voice' })
              }}
              onSubmit={() => {
                setStep(2)
                track('demo_interact', { demo: 'ops', action: 'forms_step', step: 2 })
              }}
            />
          )}
          {step === 2 && (
            <Step2Phone
              ratings={ratings}
              onRate={(skill, n) => {
                setRatings((r) => ({ ...r, [skill]: n }))
                track('demo_interact', { demo: 'ops', action: 'forms_rate', skill })
              }}
              onFillScript={() => {
                setRatings({ ...scriptedRatings })
                track('demo_interact', { demo: 'ops', action: 'forms_rate_script' })
              }}
              onSubmit={() => {
                setStep(3)
                track('demo_interact', { demo: 'ops', action: 'forms_step', step: 3 })
              }}
            />
          )}
          {step === 3 && (
            <Phone label="Trainer’s phone, already submitted">
              <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ok-wash text-ok">
                  <Check size={24} strokeWidth={3} />
                </span>
                <p className="text-[16px] font-bold">Weekly report sent</p>
                <p className="text-[13px] text-steel">The owner’s side is updating now.</p>
              </div>
            </Phone>
          )}
        </div>

        <div className="min-w-0">
          {step < 3 ? (
            <OwnerWaiting step={step} />
          ) : (
            <OwnerResults reveal={reveal} onPlayAgain={playAgain} />
          )}
        </div>
      </div>
    </div>
  )
}

function Step1Phone({
  trainerPct,
  onTrainerPct,
  voiceOn,
  onVoice,
  onSubmit,
}: {
  trainerPct: number
  onTrainerPct: (n: number) => void
  voiceOn: boolean
  onVoice: () => void
  onSubmit: () => void
}) {
  const traineePct = 100 - trainerPct
  return (
    <Phone label="Trainer’s phone · Training Report Daily">
      <div className="px-4 pb-5">
        <p className="text-[11px] font-semibold tracking-wide text-form uppercase">Training report</p>
        <h4 className="mt-1 text-[17px] font-bold">Today’s job, filled in</h4>
        <dl className="mt-3 grid gap-2 rounded-lg bg-paper px-3 py-2.5 text-[13px]">
          {[
            ['Job', '#4821'],
            ['Appliance', 'Samsung French door fridge'],
            ['Brand', 'Samsung'],
            ['Trainee', 'Kevin Lam'],
            ['Trainer', 'Marcus Reed'],
            ['Store', 'Riverside'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt className="text-steel">{k}</dt>
              <dd className="text-right font-semibold">{v}</dd>
            </div>
          ))}
        </dl>

        <label className="mt-4 block text-[13px] font-semibold" htmlFor="split">
          Who did the work?
        </label>
        <div className="mt-2 flex justify-between text-[12px] text-steel">
          <span>Trainer {trainerPct}%</span>
          <span>Trainee {traineePct}%</span>
        </div>
        <input
          id="split"
          type="range"
          min={0}
          max={100}
          step={5}
          value={trainerPct}
          onChange={(e) => onTrainerPct(Number(e.target.value))}
          className="mt-1 w-full accent-[var(--color-form)]"
        />

        <button
          type="button"
          onClick={onVoice}
          className={`mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border-2 text-[14px] font-semibold ${
            voiceOn ? 'border-ok bg-ok-wash text-ok' : 'border-line'
          }`}
        >
          <Mic size={16} /> {voiceOn ? 'Voice note captured' : 'Add a voice note'}
        </button>
        {voiceOn && (
          <p className="slide-in mt-2 rounded-md bg-paper px-3 py-2 text-[13px] text-ink/85">“{VOICE_NOTE}”</p>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={!voiceOn}
          className="mt-4 flex min-h-11 w-full items-center justify-center rounded-lg bg-form text-[14px] font-semibold text-white disabled:opacity-50"
        >
          Submit, 20 seconds
        </button>
        {!voiceOn && <p className="mt-2 text-center text-[12px] text-steel">Tap the voice note first.</p>}
      </div>
    </Phone>
  )
}

function Step2Phone({
  ratings,
  onRate,
  onFillScript,
  onSubmit,
}: {
  ratings: Partial<Record<(typeof ratingSkills)[number], number>>
  onRate: (skill: (typeof ratingSkills)[number], n: number) => void
  onFillScript: () => void
  onSubmit: () => void
}) {
  const done = ratingSkills.every((s) => ratings[s] !== undefined)

  return (
    <Phone label="Trainer’s phone · Trainer Weekly Report">
      <div className="px-4 pb-5">
        <p className="text-[11px] font-semibold tracking-wide text-form uppercase">Weekly ratings</p>
        <h4 className="mt-1 text-[17px] font-bold">Kevin Lam · this week</h4>
        <p className="mt-1 text-[12px] text-steel">Tap 1 to 5. Last week shows faintly.</p>

        <ul className="mt-3 grid gap-2.5">
          {ratingSkills.map((skill) => {
            const last = weeklyLastScores[skill]
            const current = ratings[skill]
            return (
              <li key={skill} className="rounded-lg border border-line px-2.5 py-2">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[13px] font-semibold">{skill}</p>
                  <p className="nums text-[11px] text-steel/50">Last: {last}</p>
                </div>
                <div className="mt-1.5 flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => onRate(skill, n)}
                      className={`flex h-11 flex-1 items-center justify-center rounded-md text-[14px] font-bold ${
                        current === n
                          ? n < last
                            ? 'bg-alert text-white'
                            : 'bg-form text-white'
                          : 'bg-paper text-steel hover:bg-form-wash'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>

        {!done && (
          <button type="button" onClick={onFillScript} className="mt-3 min-h-10 w-full text-[13px] font-semibold text-form underline-offset-4 hover:underline">
            Use sample scores for Kevin
          </button>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={!done}
          className="mt-3 flex min-h-11 w-full items-center justify-center rounded-lg bg-form text-[14px] font-semibold text-white disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </Phone>
  )
}

function OwnerWaiting({ step }: { step: Step }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-paper/60 p-5 sm:p-6">
      <p className="text-[13px] font-semibold text-steel">Owner’s dashboard</p>
      <h4 className="mt-1 text-[18px] font-bold">Waiting on this week’s reports</h4>
      <p className="mt-2 max-w-[42ch] text-[14px] text-steel">
        {step === 1
          ? 'The daily training report fills itself from the schedule. The trainer only sets the work split and adds a voice note.'
          : 'Next the weekly skill ratings. One skill will drop, and the system will catch it.'}
      </p>
      <ul className="mt-4 grid gap-2 text-[13px] text-steel">
        <li className="flex items-center gap-2">
          <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${step >= 1 ? 'bg-form text-white' : 'bg-line'}`}>1</span>
          Daily report from the job
        </li>
        <li className="flex items-center gap-2">
          <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${step >= 2 ? 'bg-form text-white' : 'bg-line'}`}>2</span>
          Weekly ratings in 30 seconds
        </li>
        <li className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-line text-[11px] font-bold">3</span>
          Tasks, progress and a summary
        </li>
      </ul>
    </div>
  )
}

function OwnerResults({ reveal, onPlayAgain }: { reveal: number; onPlayAgain: () => void }) {
  const kevin = trainees[0]
  return (
    <div className="rounded-xl border border-line bg-white p-4 sm:p-5">
      <p className="text-[13px] font-semibold text-steel">Owner’s dashboard · live</p>
      <h4 className="mt-1 text-[18px] font-bold">The system acts</h4>

      <div className="mt-4 grid gap-3">
        {reveal >= 1 && (
          <div className="slide-in rounded-lg border border-alert/30 bg-alert-wash px-3 py-3">
            <Pill tone="alert">Coaching task</Pill>
            <p className="mt-2 text-[14px] font-semibold">Coach Kevin on sealed-system repairs.</p>
            <p className="text-[13px] text-steel">Assigned to Marcus, due Friday.</p>
          </div>
        )}

        {reveal >= 2 && (
          <div className="slide-in">
            <TraineeProgressCard trainee={kevin} highlightDrop />
          </div>
        )}

        {reveal >= 3 && (
          <div className="slide-in rounded-lg bg-form-wash px-3 py-3">
            <p className="text-[12px] font-semibold text-form">Weekly summary</p>
            <p className="mt-1 text-[15px] font-bold">2 trainees progressing, 1 needs coaching.</p>
            <p className="mt-3 text-[14px] font-semibold text-ink">No one had to open a report.</p>
            <button
              type="button"
              onClick={onPlayAgain}
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-4 text-[14px] font-semibold"
            >
              <RotateCcw size={15} /> Play again
            </button>
          </div>
        )}

        {reveal < 3 && (
          <p className="text-[13px] text-steel" aria-live="polite">
            Updating…
          </p>
        )}
      </div>
    </div>
  )
}
