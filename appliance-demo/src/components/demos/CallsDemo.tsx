'use client'

import { useEffect, useRef, useState } from 'react'
import { BellRing, PhoneMissed, RotateCcw } from 'lucide-react'
import { Phone } from '../ui'
import { track } from '@/lib/firebase'

type Msg = { from: 'them' | 'us' | 'system'; text: string }

function script(business: string): Msg[] {
  return [
    { from: 'system', text: 'Missed call from (512) 555-0147 at 2:14 PM' },
    { from: 'us', text: `Hi, this is ${business}. Sorry we missed your call, we’re on a repair. What’s going on with your appliance?` },
    { from: 'them', text: 'My dryer runs but there’s no heat' },
    { from: 'us', text: 'Got it. What brand is it? If you can, send a photo of the tag inside the door so we bring the right part.' },
    { from: 'them', text: 'GE. [photo of model tag]' },
    { from: 'us', text: 'Thanks. That model often needs a thermal fuse or heating element, we carry both. We have tomorrow 8 to 10 or 12 to 2. Which works?' },
    { from: 'them', text: '8 to 10 please' },
    { from: 'us', text: 'You’re booked for tomorrow 8 to 10. We’ll text when the technician is on the way.' },
  ]
}

export function CallsDemo({ business }: { business: string }) {
  const msgs = script(business)
  const [shown, setShown] = useState(0)
  const box = useRef<HTMLDivElement>(null)
  const done = shown >= msgs.length

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight, behavior: 'smooth' })
  }, [shown])

  function next() {
    setShown((n) => Math.min(n + 1, msgs.length))
    if (shown === 0) track('demo_interact', { demo: 'calls', step: 'start' })
  }

  return (
    <div className="grid gap-6">
      <Phone label="What your customer sees after a call you couldn’t answer.">
        <div className="flex h-full flex-col">
          <div className="border-b border-line px-4 py-2.5 text-center">
            <p className="text-[14px] font-bold">{business}</p>
            <p className="text-[11px] text-steel">Text message</p>
          </div>
          <div ref={box} className="no-scrollbar flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {shown === 0 && (
              <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                <PhoneMissed size={36} className="text-alert" />
                <p className="mt-3 text-[14px] text-steel">You’re behind a dryer. The phone rings out.</p>
              </div>
            )}
            {msgs.slice(0, shown).map((m, i) =>
              m.from === 'system' ? (
                <p key={i} className="slide-in py-1 text-center text-[11px] font-semibold text-alert">
                  {m.text}
                </p>
              ) : (
                <div key={i} className={`slide-in flex ${m.from === 'us' ? 'justify-start' : 'justify-end'}`}>
                  <p
                    className={`max-w-[82%] rounded-2xl px-3 py-2 text-[13.5px] leading-snug ${
                      m.from === 'us' ? 'rounded-bl-md bg-paper text-ink' : 'rounded-br-md bg-form text-white'
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              ),
            )}
          </div>
          <div className="border-t border-line p-3">
            {done ? (
              <button
                onClick={() => setShown(0)}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-line text-[14px] font-semibold"
              >
                <RotateCcw size={15} /> Play again
              </button>
            ) : (
              <button onClick={next} className="min-h-11 w-full rounded-lg bg-form text-[14px] font-bold text-white">
                {shown === 0 ? 'Miss the call' : 'Next message'}
              </button>
            )}
          </div>
        </div>
      </Phone>

      {done && (
        <div className="slide-in mx-auto flex w-full max-w-[330px] gap-3 rounded-xl bg-ink p-4 text-white">
          <BellRing size={20} className="mt-0.5 shrink-0 text-signal" />
          <div className="text-[14px]">
            <p className="font-bold">New job booked while you worked</p>
            <p className="mt-0.5 text-white/75">GE dryer, no heat. Tomorrow 8 to 10. Thermal fuse and heating element suggested for the van.</p>
          </div>
        </div>
      )}
    </div>
  )
}
