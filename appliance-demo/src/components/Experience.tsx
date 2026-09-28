'use client'

import { useEffect, useState } from 'react'
import { CalendarClock, Check, ChevronDown, FileSpreadsheet, Lock, Mail, MessageCircle, Phone as PhoneIcon, ShieldCheck } from 'lucide-react'
import { Ticket, answerText, problemLabel } from './Ticket'
import { Section } from './Section'
import { Button, Pill } from './ui'
import { WebsiteDemo } from './demos/WebsiteDemo'
import { CallsDemo } from './demos/CallsDemo'
import { PaymentsDemo } from './demos/PaymentsDemo'
import { SheetsDemo } from './demos/SheetsDemo'
import { OpsDemo } from './demos/OpsDemo'
import { orderSections, sectionMeta, type Answers, type SectionId } from '@/lib/flow'
import { readVisit, type Visit } from '@/lib/params'
import { saveLead, track } from '@/lib/firebase'
import { submitDemoLead } from '@/lib/demoLead'
import { company, nextSteps, prices, promises, testimonial } from '@/config'
import { faq } from '@/data/faq'

const allSections: SectionId[] = ['website', 'calls', 'payments', 'sheets', 'ops']

export function Experience() {
  const [visit, setVisit] = useState<Visit>()
  const [answers, setAnswers] = useState<Answers>()
  const [quote, setQuote] = useState<SectionId[]>([])
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const v = readVisit()
    setVisit(v)
    track('page_open', { business: v.business, city: v.city, ref: v.ref })
    if (v.skip) setAnswers({ size: v.size, skipped: true })
  }, [])

  useEffect(() => {
    const on = () => setPastHero(window.scrollY > 520)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const order = answers ? orderSections(answers) : []
  const active = useActiveSection(answers ? [...order, 'talk'] : [])

  function done(a: Answers) {
    setAnswers(a)
    const first = orderSections(a)[0]
    if (!a.skipped) setQuote([first])
    saveLead('quiz_completed', { ...visitData(visit), answers: a })
    requestAnimationFrame(() => {
      const card = document.getElementById('plan-card')
      if (card && card.getBoundingClientRect().top < 0) card.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function toggle(id: SectionId) {
    setQuote((q) => {
      const on = q.includes(id)
      track('quote_toggle', { section: id, on: !on })
      return on ? q.filter((x) => x !== id) : [...q, id]
    })
  }

  const business = visit?.business ?? 'Your Appliance Repair'
  const city = visit?.city ?? 'your area'
  const showBar = Boolean(answers) && pastHero && active !== 'talk'

  return (
    <div className="min-h-screen">
      <Header answered={Boolean(answers)} order={order} active={active} quoteCount={quote.length} />

      <main>
        <section className="mx-auto max-w-[1180px] px-4 pt-8 pb-12 sm:px-6 sm:pt-16 sm:pb-16">
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_600px] lg:gap-14">
            <div className="lg:sticky lg:top-24 lg:pt-6">
              <h1 className={`display max-w-[18ch] ${visit?.business ? 'text-[29px] sm:text-[44px]' : 'text-[32px] sm:text-[52px]'}`}>
                {visit?.business ? `${visit.business}, let’s find where jobs slip away.` : 'Let’s find where your repair jobs slip away.'}
              </h1>
              <p className="mt-4 max-w-[46ch] text-[17px] text-ink/80 sm:mt-5 sm:text-[18px]">
                {visit?.owner ? `${visit.owner}, thanks for the call. ` : ''}
                {answers
                  ? 'Here’s what we’d fix first for a shop like yours, and what it costs. Try the demos below.'
                  : 'Answer a few taps on the work order and this page shows only what fits your business. About 30 seconds.'}
              </p>
              <TrustStrip className="mt-6 hidden sm:grid" />
              <Proof className="mt-8 hidden sm:block" />
            </div>
            {visit && !answers && (
              <div>
                <Ticket visit={visit} onDone={done} />
                <TrustStrip className="mt-6 px-1 sm:hidden" />
              </div>
            )}
            {visit && answers && <PlanCard visit={visit} answers={answers} order={order} onReset={() => setAnswers(undefined)} />}
            {!visit && <div className="h-[520px] rounded-2xl border border-line bg-card" aria-hidden />}
          </div>
        </section>

        {answers && (
          <div id="plan">
            {order.map((id, i) => (
              <SectionFor
                key={id}
                id={id}
                index={i}
                total={order.length}
                answers={answers}
                business={business}
                city={city}
                want={{ wanted: quote.includes(id), onWant: () => toggle(id) }}
              />
            ))}
            <Faq />
            <Closing visit={visit} answers={answers} quote={quote} toggle={toggle} />
          </div>
        )}
      </main>

      <footer className={`border-t border-line py-8 ${showBar ? 'pb-28 sm:pb-8' : ''}`}>
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-4 text-[13px] text-steel sm:px-6">
          <p>
            © {new Date().getFullYear()} {company.name}. Demo screens use invented sample data.
          </p>
          <a href={company.website} className="font-semibold text-ink underline-offset-4 hover:underline">
            {company.website.replace('https://', '')}
          </a>
        </div>
      </footer>

      <MobileBar show={showBar} quoteCount={quote.length} />
    </div>
  )
}

function visitData(v?: Visit) {
  return { business: v?.business ?? null, city: v?.city ?? null, owner: v?.owner ?? null, ref: v?.ref ?? null }
}

/** Which section is in the middle of the screen, for the header highlight and the mobile bar. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>()
  const key = ids.join(',')
  useEffect(() => {
    if (!ids.length || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    // Sections mount after the answers arrive
    const t = setTimeout(() => ids.forEach((id) => document.getElementById(id) && io.observe(document.getElementById(id)!)), 50)
    return () => {
      clearTimeout(t)
      io.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return active
}

function Proof({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return (
    <figure className={className}>
      <p className={`text-[13px] font-semibold ${dark ? 'text-signal' : 'text-form'}`}>From a repair shop we work with</p>
      <blockquote className={`mt-2 max-w-[48ch] text-[16px] leading-relaxed ${dark ? 'text-white/90' : 'text-ink/85'}`}>“{testimonial.quote}”</blockquote>
      <figcaption className={`mt-2 text-[14px] ${dark ? 'text-white/60' : 'text-steel'}`}>
        {testimonial.name}, {testimonial.company}
      </figcaption>
    </figure>
  )
}

function TrustStrip({ className = '' }: { className?: string }) {
  return (
    <ul className={`grid gap-2 ${className}`}>
      {promises.map((p) => (
        <li key={p} className="flex items-center gap-2.5 text-[15px] font-medium text-ink">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ok-wash text-ok" aria-hidden>
            <Check size={13} strokeWidth={3} />
          </span>
          {p}
        </li>
      ))}
    </ul>
  )
}

function Header({ answered, order, active, quoteCount }: { answered: boolean; order: SectionId[]; active?: string; quoteCount: number }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-6 px-4 sm:px-6">
        <a href="#" className="flex shrink-0 items-center gap-2 text-[16px] font-extrabold" style={{ fontStretch: '115%' }}>
          {company.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logo}
              alt={company.name}
              className="h-7 w-auto brightness-0"
            />
          ) : (
            company.name
          )}
        </a>
        {answered && (
          <>
            <nav className="hidden flex-1 gap-1 lg:flex" aria-label="Your plan">
              {order.map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-current={active === id ? 'true' : undefined}
                  className={`shrink-0 rounded-md px-2.5 py-1.5 text-[13px] font-semibold transition-colors ${
                    active === id ? 'bg-white text-ink shadow-[inset_0_-2px_0_var(--color-signal)]' : 'text-steel hover:bg-white hover:text-ink'
                  }`}
                >
                  {sectionMeta[id].nav}
                </a>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <a href="#talk" className="hidden min-h-9 items-center gap-2 rounded-md border border-line bg-white px-3 text-[13px] font-semibold sm:inline-flex">
                Your quote
                <span className="nums rounded-full bg-signal px-1.5 text-[12px]">{quoteCount}</span>
              </a>
              <a
                href={company.bookingUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => track('cta_click', { cta: 'book_call', where: 'header' })}
                className="inline-flex min-h-9 items-center rounded-md bg-form px-3 text-[13px] font-semibold text-white hover:bg-form-deep"
              >
                Book a call
              </a>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

function PlanCard({ visit, answers, order, onReset }: { visit: Visit; answers: Answers; order: SectionId[]; onReset: () => void }) {
  const summary = answers.skipped
    ? 'Everything we do, in the usual order'
    : [answerText('size', answers) && `Team: ${answerText('size', answers)}`, problemLabel(answers.problem), answerText('tracking', answers) && `Runs on ${answerText('tracking', answers)}`]
        .filter(Boolean)
        .join('. ')
  return (
    <div id="plan-card" className="slide-in mx-auto w-full max-w-[640px] scroll-mt-20">
      <div className="rounded-t-2xl bg-ink px-5 py-4 text-white sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[18px] font-bold">Your plan{visit.business ? `, ${visit.business}` : ''}</p>
            <p className="mt-0.5 text-[13px] text-white/70">{summary}</p>
          </div>
          <button onClick={onReset} className="min-h-9 shrink-0 text-[13px] font-semibold text-white/75 underline underline-offset-4 hover:text-white">
            Change answers
          </button>
        </div>
      </div>
      <div className="rounded-b-2xl border border-t-0 border-line bg-card shadow-[0_24px_48px_-28px_rgba(20,32,43,0.4)]">
        <ol>
          {order.map((id, i) => (
            <li key={id} className="border-b border-line last:border-b-0">
              <a href={`#${id}`} className="group flex items-center gap-4 px-5 py-3.5 hover:bg-paper sm:px-7">
                <span
                  className={`nums flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-bold ${
                    i === 0 && !answers.skipped ? 'bg-signal text-ink' : 'bg-paper text-steel group-hover:bg-white'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[16px] font-bold">{sectionMeta[id].nav}</span>
                    {i === 0 && !answers.skipped && <Pill tone="signal">Start here</Pill>}
                    {id === 'ops' && answers.size === 'solo' && <Pill>When you hire</Pill>}
                  </span>
                  <span className="block text-[14px] text-steel">{sectionMeta[id].outcome}</span>
                  <span className="mt-0.5 block text-[13px] font-semibold text-ink sm:hidden">{prices[id].setup}</span>
                </span>
                <span className="hidden shrink-0 text-right text-[13px] font-semibold text-ink sm:block">{prices[id].setup}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="border-t border-dashed border-line px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              href={company.bookingUrl}
              onClick={() => track('cta_click', { cta: 'book_call', where: 'plan_card' })}
              className="w-full sm:w-auto"
            >
              <CalendarClock size={18} /> Book a 15-minute call
            </Button>
            <a href={`#${order[0]}`} className="min-h-11 content-center text-center text-[15px] font-semibold text-form underline-offset-4 hover:underline sm:text-left">
              Or try the demos first
            </a>
          </div>
          <p className="mt-3 flex items-center gap-2 text-[13px] text-steel">
            <ShieldCheck size={15} className="shrink-0 text-ok" /> {promises[1] ?? 'No obligation'}. The call is free.
          </p>
        </div>
      </div>
    </div>
  )
}

function MobileBar({ show, quoteCount }: { show: boolean; quoteCount: number }) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-200 sm:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-2">
        <a
          href={company.bookingUrl}
          target="_blank"
          rel="noreferrer"
          tabIndex={show ? 0 : -1}
          onClick={() => track('cta_click', { cta: 'book_call', where: 'mobile_bar' })}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-form text-[15px] font-bold text-white"
        >
          <CalendarClock size={18} /> Book a 15-min call
        </a>
        <a
          href="#talk"
          tabIndex={show ? 0 : -1}
          className="flex min-h-12 items-center gap-1.5 rounded-lg border border-line px-3 text-[14px] font-semibold"
          aria-label={`Your quote, ${quoteCount} items`}
        >
          Quote <span className="nums rounded-full bg-signal px-1.5 text-[12px]">{quoteCount}</span>
        </a>
        <a
          href={`tel:${company.phone.replace(/[^+\d]/g, '')}`}
          tabIndex={show ? 0 : -1}
          onClick={() => track('cta_click', { cta: 'phone', where: 'mobile_bar' })}
          className="flex h-12 w-12 items-center justify-center rounded-lg border border-line"
          aria-label="Call us"
        >
          <PhoneIcon size={18} />
        </a>
      </div>
    </div>
  )
}

function Faq() {
  return (
    <section id="faq" className="border-t border-line py-14 sm:py-20">
      <div className="mx-auto grid max-w-[1180px] gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <h2 className="display max-w-[16ch] text-[28px] sm:text-[36px]">Questions owners ask us</h2>
          <p className="mt-4 max-w-[40ch] text-[16px] text-steel">Something else on your mind? Ask it on the call, that’s what it’s for.</p>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {faq.map((f) => (
            <details key={f.q} className="group" onToggle={(e) => (e.currentTarget as HTMLDetailsElement).open && track('faq_open', { q: f.q.slice(0, 60) })}>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown size={20} className="shrink-0 text-steel transition-transform group-open:rotate-180" />
              </summary>
              <p className="max-w-[62ch] pb-5 text-[16px] text-ink/80">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionFor({
  id,
  index,
  total,
  answers,
  business,
  city,
  want,
}: {
  id: SectionId
  index: number
  total: number
  answers: Answers
  business: string
  city: string
  want: { wanted: boolean; onWant: () => void }
}) {
  const bridge = index === 0 ? undefined : sectionMeta[id].bridge
  const top = index === 0 && !answers.skipped ? 'your top priority' : undefined

  switch (id) {
    case 'website':
      return (
        <Section
          id={id}
          index={index}
          total={total}
          bridge={bridge}
          eyebrowNote={top}
          business={business}
          {...want}
          title="Show up on Google and let people book without calling"
          problem="Most people search “appliance repair near me” and call the first shop that looks trustworthy and answers. If you don’t have a site, or it’s slow on a phone, they never get to you."
          points={[
            'A fast website built for phones, with your brands, appliances and service area',
            `A page for each neighborhood you cover, so you show up in searches around ${city}`,
            'Online booking that asks for the brand, symptoms and a photo of the model tag',
            'Google Business Profile set up and kept active, with your real reviews shown on the site',
            'Every booking lands on your calendar, not in a voicemail',
          ]}
          price={prices.website}
          demo={<WebsiteDemo business={business} city={city} />}
        />
      )
    case 'calls':
      return (
        <Section
          id={id}
          index={index}
          total={total}
          bridge={bridge}
          eyebrowNote={top}
          business={business}
          {...want}
          title="Stop losing the calls you can’t pick up"
          problem="When you’re under a sink with wet hands, the phone rings out and the customer calls the next shop on Google. A missed call is usually a lost job."
          points={[
            'Missed calls get an instant text from your business number',
            'The text asks the right questions: appliance, brand, symptoms, model tag photo, error codes',
            'Customers pick a time window from your real schedule',
            'Optional AI phone answering after hours, with anything unusual passed to you',
            'You get a short summary so you arrive with the right parts',
          ]}
          price={prices.calls}
          demo={<CallsDemo business={business} />}
        />
      )
    case 'payments':
      return (
        <Section
          id={id}
          index={index}
          total={total}
          bridge={bridge}
          eyebrowNote={top}
          business={business}
          {...want}
          title="Get paid at the door and collect reviews on autopilot"
          problem="Paper invoices get paid late, and asking for reviews is easy to forget at the end of a long day. Both cost you money and new customers."
          points={[
            'Invoice from your phone before you leave, paid by card or bank transfer on the spot',
            'Automatic payment reminders for anything left unpaid',
            'Payments sync to QuickBooks so there’s nothing to type up at night',
            'Happy customers are asked for a Google review, unhappy ones reach you privately first',
          ]}
          price={prices.payments}
          demo={<PaymentsDemo business={business} />}
        />
      )
    case 'sheets':
      return (
        <Section
          id={id}
          index={index}
          total={total}
          bridge={bridge}
          eyebrowNote={top}
          business={business}
          {...want}
          wideDemo
          title="Turn your spreadsheets into software your team actually uses"
          problem="Google Sheets and Excel work until three people edit the same file, a tab gets deleted, and nobody is reminded about the part that never got ordered. You already know where the mess is. We just build the tidy version."
          points={[
            'Your own app built around how you already work, with your columns and your words',
            'Roles, so technicians see their jobs, managers see the team, and you see everything',
            'Approvals with limits, like managers approving parts under $150 and bigger ones coming to you',
            'Tasks, reminders and notifications on everyone’s phone',
            'We move your existing data over, and you can still export to Excel any time',
          ]}
          price={prices.sheets}
          demo={<SheetsDemo />}
          footer={<SheetOffer />}
        />
      )
    case 'ops':
      return (
        <Section
          id={id}
          index={index}
          total={total}
          bridge={bridge}
          eyebrowNote={answers.size === 'solo' ? 'for when you hire' : top}
          business={business}
          {...want}
          wideDemo
          title="Run technicians, stock, forms and complaints from one dashboard"
          problem="With several technicians, the hard part isn’t the repairs. It’s knowing who is trained on what, who is on leave, which van has the part, what got lost, and which customer is still waiting for a callback."
          points={[
            'Team: technician profiles, performance, training and certificates, leave, interns and 360 feedback',
            'Inventory: stock across warehouses, stores and vans, transfers, lost items and vehicle upkeep',
            'Forms: job completion, issue reports, parts and leave requests, with photos and signatures',
            'Support: every complaint and callback tracked with an owner until it’s resolved',
            'Works alongside Jobber or Housecall Pro if you already use them, so nothing gets thrown away',
          ]}
          price={prices.ops}
          demo={<OpsDemo first={answers.cracks?.[0]} />}
        />
      )
  }
}

function SheetOffer() {
  return (
    <div className="mt-10 grid gap-6 rounded-2xl bg-form p-6 text-white sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
      <div className="flex gap-4">
        <FileSpreadsheet size={32} className="mt-1 shrink-0 text-signal" />
        <div>
          <h3 className="text-[22px] font-bold">Send us one of your sheets</h3>
          <p className="mt-2 max-w-[56ch] text-white/85">
            We’ll turn it into a working preview with one or two screens, free, within a few days. You’ll see your own jobs, parts or staff list as an app before you decide anything.
          </p>
          <p className="mt-3 flex items-start gap-2 text-[14px] text-white/75">
            <Lock size={14} className="mt-[3px] shrink-0" /> Your data stays yours. We only use it for your preview and delete it if you don’t go ahead.
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        href={`mailto:${company.email}?subject=${encodeURIComponent('Sheet for a preview')}`}
        onClick={() => {
          track('cta_click', { cta: 'send_sheet' })
          saveLead('sheet_offer', {})
        }}
        className="border-transparent"
      >
        Email us your sheet
      </Button>
    </div>
  )
}

function Closing({ visit, answers, quote, toggle }: { visit?: Visit; answers: Answers; quote: SectionId[]; toggle: (id: SectionId) => void }) {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: visit?.owner ?? '',
    business: visit?.business ?? '',
    email: '',
    phone: '',
    note: '',
    website: '',
  })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (form.website) return // honeypot
    setError('')
    setSending(true)

    const lead = {
      ...visitData(visit),
      answers,
      interests: quote,
      name: form.name,
      email: form.email,
      phone: form.phone,
      business: form.business,
      note: form.note,
    }

    const result = await submitDemoLead({
      name: form.name,
      email: form.email,
      phone: form.phone,
      business: form.business,
      note: form.note,
      interests: quote,
      website: form.website,
    })

    // Keep a Firestore copy when Firebase is configured (analytics / backup).
    await saveLead('contact_form', lead)
    track('cta_click', { cta: 'contact_form', items: quote.length, emailed: result.ok })

    setSending(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setSent(true)
  }

  return (
    <section id="talk" className="scroll-mt-20 bg-ink py-16 text-white sm:py-20">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_480px] lg:gap-16">
        <div>
          <h2 className="display max-w-[18ch] text-[30px] sm:text-[44px]">Start with one fix, add the rest when it pays off.</h2>
          <p className="mt-5 max-w-[52ch] text-[17px] text-white/80">
            Pick what you want priced, then book a time or have us call you. Here’s what happens next.
          </p>

          <ol className="mt-8 grid max-w-[52ch] gap-5">
            {nextSteps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="nums flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-signal text-[14px] font-bold text-signal">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[17px] font-bold">{s.title}</p>
                  <p className="text-[15px] text-white/70">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <Proof dark className="mt-9 max-w-[52ch]" />

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={company.bookingUrl} onClick={() => track('cta_click', { cta: 'book_call', where: 'closing' })} className="bg-signal text-ink hover:bg-white">
              <CalendarClock size={18} /> Book a 15-minute call
            </Button>
            {company.whatsapp && (
              <Button href={company.whatsapp} variant="ghost" onClick={() => track('cta_click', { cta: 'whatsapp' })}>
                <MessageCircle size={18} /> WhatsApp
              </Button>
            )}
          </div>
          <ul className="mt-7 grid gap-2 text-[15px] text-white/80">
            <li className="flex items-center gap-2">
              <PhoneIcon size={15} /> <a href={`tel:${company.phone.replace(/[^+\d]/g, '')}`}>{company.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} /> <a href={`mailto:${company.email}`}>{company.email}</a>
            </li>
          </ul>
        </div>

        <div className="order-first rounded-2xl bg-white p-5 text-ink sm:p-7 lg:order-none">
          {sent ? (
            <div className="slide-in py-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ok-wash text-ok">
                <Check size={26} strokeWidth={3} />
              </span>
              <h3 className="mt-4 text-[22px] font-bold">Got it, thanks{form.name ? `, ${form.name}` : ''}.</h3>
              <p className="mt-2 text-steel">We’ll call you within one business day{quote.length ? ` about ${quote.map((q) => sectionMeta[q].nav.toLowerCase()).join(', ')}` : ''}.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4">
              <div>
                <h3 className="text-[20px] font-bold">Get a quote for your shop</h3>
                <p className="mt-1 text-[14px] text-steel">Tap what you want priced. You can change it on the call.</p>
              </div>
              <fieldset>
                <legend className="sr-only">What to include</legend>
                <div className="flex flex-wrap gap-2">
                  {allSections.map((id) => {
                    const on = quote.includes(id)
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggle(id)}
                        aria-pressed={on}
                        className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 px-3.5 text-[14px] font-semibold transition-colors ${
                          on ? 'border-form bg-form text-white' : 'border-line text-ink hover:border-ink'
                        }`}
                      >
                        {on && <Check size={14} strokeWidth={3} />}
                        {sectionMeta[id].nav}
                      </button>
                    )
                  })}
                </div>
                {quote.length > 0 && (
                  <ul className="mt-3 grid gap-1 rounded-lg bg-paper px-3 py-2.5 text-[13px]">
                    {quote.map((id) => (
                      <li key={id} className="flex justify-between gap-3">
                        <span>{sectionMeta[id].nav}</span>
                        <span className="font-semibold">{prices[id].setup}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </fieldset>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} autoComplete="name" required />
                <Field label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} autoComplete="tel" required />
              </div>
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} autoComplete="email" required />
              <Field label="Business name" value={form.business} onChange={(v) => setForm({ ...form, business: v })} autoComplete="organization" />
              <label className="grid gap-1 text-[14px] font-semibold">
                Best time to call, or anything else
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="rounded-lg border border-line px-3 py-2 text-[16px] font-normal"
                />
              </label>
              <input
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="hidden"
                name="website"
              />
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={sending}>
                {sending
                  ? 'Sending…'
                  : quote.length
                    ? `Get my quote (${quote.length} item${quote.length > 1 ? 's' : ''})`
                    : 'Request a call'}
              </Button>
              <p className="flex items-start gap-2 text-[12px] text-steel">
                <Lock size={13} className="mt-0.5 shrink-0" /> We only use your details to follow up on this quote (sales@stellixsoft.com).
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoComplete?: string
  required?: boolean
}) {
  return (
    <label className="grid min-w-0 gap-1 text-[14px] font-semibold">
      {label}
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="min-h-11 w-full min-w-0 rounded-lg border border-line px-3 text-[16px] font-normal"
      />
    </label>
  )
}
