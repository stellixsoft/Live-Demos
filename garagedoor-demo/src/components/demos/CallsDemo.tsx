'use client'

import { useEffect, useRef, useState } from 'react'
import { BellRing, PhoneMissed, RotateCcw } from 'lucide-react'
import { Phone } from '../ui'
import { track } from '@/lib/firebase'

type Msg = { from: 'them' | 'us' | 'system'; text: string }

function script(business: string): Msg[] {
  return [
    { from: 'system', text: 'Missed call from (281) 555-0147 at 7:52 AM' },
    { from: 'us', text: `Hi, this is ${business}. Sorry we missed your call, we’re on a job. What’s going on with your garage door?` },
    { from: 'them', text: 'Loud bang last night, now the door won’t open and my car is stuck inside' },
    { from: 'us', text: 'That’s usually a broken spring. Please don’t try to lift it by hand, it’s very heavy without the spring. Can you send a photo of the springs above the door?' },
    { from: 'them', text: '[photo of a torsion spring with a gap in it]' },
    { from: 'us', text: 'Thanks, that’s a broken torsion spring. We carry them on the truck and can be there today between 10 and 12. Does that work?' },
    { from: 'them', text: 'Yes please' },
    { from: 'us', text: 'You’re booked for today 10 to 12. We’ll text when the technician is on the way.' },
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
                <p className="mt-3 text-[14px] text-steel">You’re up a ladder on another job. The phone rings out.</p>
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
            <p className="font-bold">Emergency job booked while you worked</p>
            <p className="mt-0.5 text-white/75">Broken torsion spring, double door, car stuck inside. Today 10 to 12. Photo attached so you can match the spring size.</p>
          </div>
        </div>
      )}
    </div>
  )
}
