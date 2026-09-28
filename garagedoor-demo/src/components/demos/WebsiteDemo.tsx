'use client'

import { useState } from 'react'
import { Camera, CheckCircle2, ChevronLeft, MapPin, Phone as PhoneIcon, Star } from 'lucide-react'
import { Phone } from '../ui'
import { track } from '@/lib/firebase'

const appliances = ['Broken spring', 'Opener not working', 'Door off track', 'Snapped cable', 'Won’t close all the way', 'New door quote']
const brands = ['Single door', 'Double door', 'Not sure']
const slots = ['Today 2:00 to 4:00', 'Today 5:00 to 7:00', 'Tomorrow 8:00 to 10:00']

export function WebsiteDemo({ business, city }: { business: string; city: string }) {
  const [step, setStep] = useState(0)
  const [appliance, setAppliance] = useState<string>()
  const [brand, setBrand] = useState<string>()
  const [photo, setPhoto] = useState(false)
  const [slot, setSlot] = useState<string>()

  function go(n: number) {
    setStep(n)
    track('demo_interact', { demo: 'website', step: n })
  }

  function reset() {
    setStep(0)
    setAppliance(undefined)
    setBrand(undefined)
    setPhoto(false)
    setSlot(undefined)
  }

  return (
    <div className="grid gap-6 sm:grid-cols-[1fr] ">
      <Phone label="Your website on a customer’s phone. Tap through a booking.">
        {step === 0 && (
          <div className="slide-in">
            <div className="bg-form px-5 pt-5 pb-7 text-white">
              <p className="text-[13px] font-semibold text-white/80">{business}</p>
              <h3 className="mt-3 text-[25px] leading-[1.1] font-extrabold" style={{ fontStretch: '115%' }}>
                Garage door repair in {city}, same day
              </h3>
              <p className="mt-2 flex items-center gap-1.5 text-[13px] text-white/85">
                <Star size={14} className="fill-signal text-signal" /> Your Google rating shows here
              </p>
              <button onClick={() => go(1)} className="mt-5 w-full rounded-lg bg-signal py-3 text-[15px] font-bold text-ink">
                Book a repair online
              </button>
              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[13px] text-white/85">
                <PhoneIcon size={13} /> or call, we pick up
              </p>
            </div>
            <div className="px-5 py-5">
              <p className="text-[13px] font-bold text-ink">We fix and install</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {appliances.map((a) => (
                  <span key={a} className="rounded-full bg-paper px-2.5 py-1 text-[12px] text-ink">
                    {a}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-[13px] font-bold text-ink">Brands we install and service</p>
              <p className="mt-1 text-[13px] text-steel">LiftMaster, Chamberlain, Genie, Clopay, Amarr, Wayne Dalton, CHI</p>
              <p className="mt-5 flex items-start gap-1.5 text-[13px] text-steel">
                <MapPin size={14} className="mt-0.5 shrink-0" /> Serving {city} and nearby neighborhoods. Each one gets its own page so Google shows you there.
              </p>
            </div>
          </div>
        )}

        {step > 0 && step < 5 && (
          <div className="slide-in px-5 pt-3 pb-6" key={step}>
            <div className="flex items-center justify-between">
              <button onClick={() => go(step - 1)} className="-ml-1 flex min-h-9 items-center text-[13px] font-semibold text-steel">
                <ChevronLeft size={16} /> Back
              </button>
              <span className="nums text-[12px] text-steel">Step {step} of 4</span>
            </div>
            <div className="mt-1 h-1 rounded bg-paper">
              <div className="h-1 rounded bg-form transition-all" style={{ width: `${step * 25}%` }} />
            </div>

            {step === 1 && (
              <>
                <h4 className="mt-5 text-[19px] font-bold">What’s going on with the door?</h4>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {appliances.map((a) => (
                    <button
                      key={a}
                      onClick={() => {
                        setAppliance(a)
                        go(2)
                      }}
                      className="min-h-14 rounded-lg border-2 border-line px-2 text-[14px] font-semibold hover:border-form"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h4 className="mt-5 text-[19px] font-bold">Is it a single or double door?</h4>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        setBrand(b)
                        go(3)
                      }}
                      className="min-h-12 rounded-lg border-2 border-line text-[14px] font-semibold hover:border-form"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h4 className="mt-5 text-[19px] font-bold">Anything else we should know?</h4>
                <div className="mt-3 rounded-lg border-2 border-line p-3 text-[14px] text-ink">
                  Heard a loud bang last night. Door won’t open and my car is inside.
                </div>
                <button
                  onClick={() => setPhoto(true)}
                  className={`mt-3 flex min-h-14 w-full items-center gap-3 rounded-lg border-2 border-dashed px-3 text-left text-[14px] ${
                    photo ? 'border-ok bg-ok-wash' : 'border-form/40'
                  }`}
                >
                  {photo ? (
                    <>
                      <span className="flex h-10 w-12 shrink-0 flex-col justify-center rounded bg-white px-1 text-[7px] leading-tight text-steel shadow-sm">
                        <span>SPRING</span>
                        <span>GAP VISIBLE</span>
                      </span>
                      <span className="font-semibold text-ok">Photo added. It shows a broken torsion spring, so the tech loads the right pair.</span>
                    </>
                  ) : (
                    <>
                      <Camera size={22} className="shrink-0 text-form" />
                      <span>
                        <span className="block font-semibold">Add a photo of the springs above the door</span>
                        <span className="text-[12px] text-steel">From inside the garage. Optional.</span>
                      </span>
                    </>
                  )}
                </button>
                <button onClick={() => go(4)} className="mt-4 w-full rounded-lg bg-form py-3 text-[15px] font-bold text-white">
                  Choose a time
                </button>
              </>
            )}

            {step === 4 && (
              <>
                <h4 className="mt-5 text-[19px] font-bold">Pick a time window</h4>
                <div className="mt-3 grid gap-2">
                  {slots.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSlot(s)
                        go(5)
                      }}
                      className="min-h-12 rounded-lg border-2 border-line px-3 text-left text-[14px] font-semibold hover:border-form"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-[12px] text-steel">Only real openings from your schedule are shown. Car stuck inside? Today’s slots are held for emergencies.</p>
              </>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="slide-in px-5 pt-10 pb-6 text-center">
            <CheckCircle2 size={48} className="mx-auto text-ok" />
            <h4 className="mt-3 text-[20px] font-bold">You’re booked</h4>
            <p className="mt-2 text-[14px] text-steel">
              {appliance}, {brand?.toLowerCase()}, {slot}. We’ll text you when the technician is on the way. Please don’t try to lift the door by hand.
            </p>
            <div className="mt-6 rounded-lg bg-paper p-3 text-left text-[13px]">
              <p className="font-bold">On your side, instantly:</p>
              <p className="mt-1 text-steel">
                New job on your calendar with the problem, door size {photo ? 'and spring photo' : ''} already filled in. No phone tag.
              </p>
            </div>
            <button onClick={reset} className="mt-6 text-[14px] font-semibold text-form underline underline-offset-4">
              Start over
            </button>
          </div>
        )}
      </Phone>
    </div>
  )
}
