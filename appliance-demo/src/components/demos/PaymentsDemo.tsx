'use client'

import { useState } from 'react'
import { CheckCircle2, CreditCard, RotateCcw, Star } from 'lucide-react'
import { Phone } from '../ui'
import { track } from '@/lib/firebase'

export function PaymentsDemo({ business }: { business: string }) {
  const [stage, setStage] = useState<'invoice' | 'paid' | 'rate' | 'happy' | 'unhappy'>('invoice')
  const [stars, setStars] = useState(0)

  function rate(n: number) {
    setStars(n)
    setStage(n >= 4 ? 'happy' : 'unhappy')
    track('demo_interact', { demo: 'payments', rating: n })
  }

  return (
    <Phone label="Invoice at the door, then a review request an hour later.">
      <div className="px-5 pt-4 pb-6">
        {stage === 'invoice' && (
          <div className="slide-in">
            <p className="text-[13px] font-semibold text-steel">{business}</p>
            <h4 className="mt-1 text-[20px] font-bold">Invoice #2231</h4>
            <div className="mt-4 divide-y divide-line rounded-lg border border-line text-[14px]">
              {[
                ['Service call and diagnosis', '$89'],
                ['Thermal fuse, GE dryer', '$38'],
                ['Heating element, GE dryer', '$96'],
                ['Labor', '$120'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 px-3 py-2.5">
                  <span>{k}</span>
                  <span className="nums font-semibold">{v}</span>
                </div>
              ))}
              <div className="flex justify-between px-3 py-2.5 text-[16px] font-bold">
                <span>Total</span>
                <span className="nums">$343</span>
              </div>
            </div>
            <p className="mt-3 text-[12px] text-steel">90-day warranty on parts and labor. Photos of the old parts are attached.</p>
            <button
              onClick={() => setStage('paid')}
              className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-form text-[15px] font-bold text-white"
            >
              <CreditCard size={17} /> Pay $343 now
            </button>
            <p className="mt-2 text-center text-[12px] text-steel">Card, Apple Pay, Google Pay or bank transfer</p>
          </div>
        )}

        {stage === 'paid' && (
          <div className="slide-in pt-8 text-center">
            <CheckCircle2 size={48} className="mx-auto text-ok" />
            <h4 className="mt-3 text-[20px] font-bold">Paid, thank you</h4>
            <p className="mt-2 text-[14px] text-steel">Receipt sent by text and email. It’s in your books already, no typing it into QuickBooks later.</p>
            <button onClick={() => setStage('rate')} className="mt-8 min-h-11 w-full rounded-lg border border-line text-[14px] font-semibold">
              One hour later
            </button>
          </div>
        )}

        {stage === 'rate' && (
          <div className="slide-in pt-6">
            <p className="rounded-2xl rounded-bl-md bg-paper px-3 py-2.5 text-[14px]">
              Hi, it’s {business}. How did Marcus do with your dryer today? Tap a star.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => rate(n)} aria-label={`${n} star${n > 1 ? 's' : ''}`} className="p-1">
                  <Star size={34} className="text-signal hover:fill-signal" />
                </button>
              ))}
            </div>
            <p className="mt-4 text-center text-[12px] text-steel">Try a 5 and then a 2 to see both paths</p>
          </div>
        )}

        {stage === 'happy' && (
          <div className="slide-in pt-6">
            <Stars n={stars} />
            <p className="mt-4 rounded-2xl rounded-bl-md bg-paper px-3 py-2.5 text-[14px]">
              That made our day. Would you share it on Google? It takes 20 seconds and helps a small local shop a lot.
            </p>
            <div className="mt-4 rounded-lg border border-line p-3 text-[13px]">
              <p className="font-bold">Opens your Google review page</p>
              <p className="text-steel">Every happy customer gets asked, every time, without you remembering.</p>
            </div>
            <Again onClick={() => setStage('rate')} />
          </div>
        )}

        {stage === 'unhappy' && (
          <div className="slide-in pt-6">
            <Stars n={stars} />
            <p className="mt-4 rounded-2xl rounded-bl-md bg-paper px-3 py-2.5 text-[14px]">
              We’re sorry it wasn’t right. The owner will call you today to fix it.
            </p>
            <div className="mt-4 rounded-lg border border-alert/30 bg-alert-wash p-3 text-[13px]">
              <p className="font-bold text-alert">Sent privately to you, not to Google</p>
              <p className="text-ink/80">You get a chance to make it right before it becomes a public 2-star review.</p>
            </div>
            <Again onClick={() => setStage('rate')} />
          </div>
        )}
      </div>
    </Phone>
  )
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex justify-center gap-1" aria-label={`${n} stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={26} className={i <= n ? 'fill-signal text-signal' : 'text-line'} />
      ))}
    </div>
  )
}

function Again({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-6 flex min-h-10 w-full items-center justify-center gap-2 text-[14px] font-semibold text-form">
      <RotateCcw size={14} /> Try another rating
    </button>
  )
}
