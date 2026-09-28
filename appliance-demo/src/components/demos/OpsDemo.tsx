'use client'

import { useState } from 'react'
import { AlertTriangle, ArrowRightLeft, Check, GraduationCap, MessageSquareText, Truck, X } from 'lucide-react'
import { Pill, Tabs, money } from '../ui'
import { track } from '@/lib/firebase'
import type { Crack } from '@/lib/flow'
import { leaveRequests, locations, lostItems, parts as initialParts, techs, tickets as initialTickets, todaysJobs, vehicles, type Part, type Ticket } from '@/data/sample'
import { beforeSubmissions, otherForms, trainees } from '@/data/training'
import { FormsAfter } from './FormsStory'
import { TraineeProgressCard } from './TraineeProgressCard'

type Tab = 'today' | 'team' | 'inventory' | 'paperwork' | 'support'

function initialTab(first?: Crack): Tab {
  if (!first) return 'today'
  if (first === 'training') return 'paperwork'
  return first
}

export function OpsDemo({ first }: { first?: Crack }) {
  const [tab, setTab] = useState<Tab>(initialTab(first))
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 bg-ink px-3 py-2.5 sm:px-4">
        <p className="px-1 text-[14px] font-bold text-white">Operations</p>
        <Tabs<Tab>
          dark
          value={tab}
          onChange={(t) => {
            setTab(t)
            track('demo_interact', { demo: 'ops', tab: t })
          }}
          tabs={[
            { id: 'today', label: 'Today' },
            { id: 'team', label: 'Team', count: leaveRequests.length },
            { id: 'inventory', label: 'Inventory', count: 3 },
            { id: 'paperwork', label: 'Forms' },
            { id: 'support', label: 'Support', count: 1 },
          ]}
        />
      </div>
      <div className="min-h-[460px] p-4 sm:p-5">
        {tab === 'today' && <Today />}
        {tab === 'team' && <Team />}
        {tab === 'inventory' && <Inventory />}
        {tab === 'paperwork' && <Forms />}
        {tab === 'support' && <Support />}
      </div>
    </div>
  )
}

function Today() {
  const done = todaysJobs.filter((j) => j.status === 'Done')
  const revenue = done.reduce((s, j) => s + (j.amount ?? 0), 0)
  return (
    <div className="slide-in">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {[
          ['Jobs today', `${todaysJobs.length * 3}`, 'across 4 technicians'],
          ['Collected so far', money(revenue * 3), 'card and bank transfer'],
          ['First-time fix, 30 days', '79%', 'up from 71%'],
          ['Callbacks this week', '3', '2 are wrong-part trips'],
        ].map(([k, v, s]) => (
          <div key={k} className="rounded-lg bg-paper px-3 py-2.5">
            <p className="text-[12px] text-steel">{k}</p>
            <p className="nums text-[22px] font-bold">{v}</p>
            <p className="text-[12px] text-steel">{s}</p>
          </div>
        ))}
      </div>
      <h4 className="mt-6 text-[15px] font-bold">Marcus Reed’s route today</h4>
      <ul className="mt-2 divide-y divide-line rounded-lg border border-line">
        {todaysJobs.map((j) => (
          <li key={j.time} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2.5 text-[14px]">
            <span className="nums w-12 shrink-0 font-semibold">{j.time}</span>
            <span className="min-w-0 flex-1">
              <span className="font-semibold">{j.customer}</span>
              <span className="text-steel">, {j.appliance}</span>
            </span>
            <span className="text-[13px] text-steel">{j.area}</span>
            <Pill tone={j.status === 'Done' ? 'ok' : j.status === 'Needs part' ? 'alert' : j.status === 'In progress' ? 'form' : 'plain'}>{j.status}</Pill>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Team() {
  const [view, setView] = useState<'people' | 'training'>('people')
  return (
    <div className="slide-in">
      <div className="mb-4 inline-flex rounded-xl border border-line bg-paper p-1" role="tablist">
        {(['people', 'training'] as const).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => {
              setView(v)
              track('demo_interact', { demo: 'ops', teamView: v })
            }}
            className={`min-h-10 rounded-lg px-4 text-[14px] font-semibold ${view === v ? 'bg-ink text-white' : 'text-steel'}`}
          >
            {v === 'people' ? 'People' : 'Training'}
          </button>
        ))}
      </div>
      {view === 'people' ? <TeamPeople /> : <TeamTraining />}
    </div>
  )
}

function TeamTraining() {
  const [sel, setSel] = useState(trainees[0].id)
  const t = trainees.find((x) => x.id === sel)!
  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {trainees.map((x) => (
          <button
            key={x.id}
            onClick={() => {
              setSel(x.id)
              track('demo_interact', { demo: 'ops', trainee: x.id })
            }}
            className={`min-h-10 shrink-0 rounded-full border px-3 text-[13px] font-semibold ${sel === x.id ? 'border-ink bg-ink text-white' : 'border-line text-steel'}`}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div className="mt-3 max-w-md">
        <TraineeProgressCard key={t.id} trainee={t} highlightDrop={t.id === 'tr1'} />
      </div>
    </div>
  )
}

function TeamPeople() {
  const [sel, setSel] = useState(techs[0].id)
  const [leaves, setLeaves] = useState(leaveRequests)
  const t = techs.find((x) => x.id === sel)!
  const maxJobs = Math.max(...techs.map((x) => x.jobsWeek))
  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
      <div>
        <ul className="grid gap-1.5">
          {techs.map((x) => (
            <li key={x.id}>
              <button
                onClick={() => setSel(x.id)}
                className={`flex min-h-14 w-full items-center gap-3 rounded-lg border px-3 py-2 text-left ${sel === x.id ? 'border-form bg-form-wash' : 'border-line hover:border-ink'}`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-[13px] font-bold text-white">
                  {x.name.split(' ').map((p) => p[0]).join('')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{x.name}</span>
                  <span className="block text-[12px] text-steel">{x.role}</span>
                </span>
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${x.status === 'On leave' ? 'bg-steel/40' : x.status === 'Available' ? 'bg-ok' : 'bg-signal'}`}
                  title={x.status}
                />
              </button>
            </li>
          ))}
        </ul>

        <h5 className="mt-5 text-[14px] font-bold">Leave requests</h5>
        <ul className="mt-2 grid gap-2">
          {leaves.length === 0 && <li className="text-[13px] text-steel">All handled. The schedule already knows.</li>}
          {leaves.map((l) => (
            <li key={l.id} className="rounded-lg border border-line p-2.5 text-[13px]">
              <p className="font-semibold">{l.who}</p>
              <p className="text-steel">
                {l.dates}, {l.reason.toLowerCase()}
              </p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => setLeaves((ls) => ls.filter((x) => x.id !== l.id))} className="flex min-h-9 flex-1 items-center justify-center gap-1 rounded-md bg-ok text-[13px] font-semibold text-white">
                  <Check size={14} /> Approve
                </button>
                <button onClick={() => setLeaves((ls) => ls.filter((x) => x.id !== l.id))} className="flex min-h-9 flex-1 items-center justify-center gap-1 rounded-md border border-line text-[13px] font-semibold">
                  <X size={14} /> Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div key={t.id} className="slide-in min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h4 className="text-[20px] font-bold">{t.name}</h4>
            <p className="text-[14px] text-steel">
              {t.role}, {t.van}. {t.skills.join(', ')}
            </p>
          </div>
          <Pill tone={t.status === 'On leave' ? 'plain' : t.status === 'Available' ? 'ok' : 'signal'}>{t.status}</Pill>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ['Jobs this week', String(t.jobsWeek)],
            ['First-time fix', `${t.firstFix}%`],
            ['Callbacks', String(t.callbacks)],
            ['Revenue this week', money(t.revenueWeek)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-paper px-3 py-2">
              <p className="text-[12px] text-steel">{k}</p>
              <p className={`nums text-[19px] font-bold ${k === 'First-time fix' && t.firstFix < 75 ? 'text-alert' : ''}`}>{v}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[13px] font-semibold text-steel">Jobs this week, whole team</p>
        <div className="mt-2 grid gap-1.5">
          {techs.map((x) => (
            <div key={x.id} className="flex items-center gap-3 text-[13px]">
              <span className="w-24 shrink-0 truncate">{x.name.split(' ')[0]}</span>
              <span className="h-3 flex-1 rounded-sm bg-paper">
                <span className={`block h-3 rounded-sm ${x.id === t.id ? 'bg-form' : 'bg-steel/30'}`} style={{ width: `${(x.jobsWeek / maxJobs) * 100}%` }} />
              </span>
              <span className="nums w-6 text-right">{x.jobsWeek}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <h5 className="flex items-center gap-2 text-[14px] font-bold">
              <GraduationCap size={16} /> Training and certificates
            </h5>
            <ul className="mt-2 grid gap-1.5 text-[13px]">
              {t.training.map((tr) => (
                <li key={tr.name} className="flex items-center justify-between gap-2 rounded-md bg-paper px-2.5 py-2">
                  <span>{tr.name}</span>
                  {tr.done ? <Pill tone="ok">Done</Pill> : <Pill tone={tr.due === 'Overdue' ? 'alert' : 'signal'}>{tr.due}</Pill>}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="flex items-center gap-2 text-[14px] font-bold">
              <MessageSquareText size={16} /> 360 feedback
            </h5>
            <ul className="mt-2 grid gap-1.5 text-[13px]">
              {t.feedback.map((f) => (
                <li key={f.note} className="rounded-md bg-paper px-2.5 py-2">
                  <span className="font-semibold">{f.from}: </span>
                  {f.note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Inventory() {
  const [stock, setStock] = useState<Part[]>(initialParts)
  const [where, setWhere] = useState<string>('all')
  const [moved, setMoved] = useState<string>()

  const low = (p: Part) => Object.values(p.stock).reduce((a, b) => a + b, 0) < p.min
  const nameOf = (id: string) => locations.find((l) => l.id === id)!.name

  function transfer(sku: string) {
    // Move one unit from the location with the most stock to Van 2 (or the selected van)
    const p = stock.find((x) => x.sku === sku)!
    const target = where.startsWith('v') ? where : 'v2'
    const from = Object.entries(p.stock)
      .filter(([k]) => k !== target)
      .sort((a, b) => b[1] - a[1])[0]
    if (!from || from[1] === 0) {
      setMoved(`No spare ${p.name.toLowerCase()} anywhere. A purchase order was drafted for approval.`)
    } else {
      setStock((ps) => ps.map((x) => (x.sku === sku ? { ...x, stock: { ...x.stock, [from[0]]: from[1] - 1, [target]: x.stock[target] + 1 } } : x)))
      setMoved(`1 × ${p.name} moved from ${nameOf(from[0])} to ${nameOf(target)}. Both counts updated.`)
    }
    setTimeout(() => setMoved(undefined), 3200)
  }

  const cols = where === 'all' ? locations : locations.filter((l) => l.id === where)

  return (
    <div className="slide-in">
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {[{ id: 'all', name: 'All locations' }, ...locations].map((l) => (
          <button
            key={l.id}
            onClick={() => setWhere(l.id)}
            className={`min-h-9 shrink-0 rounded-full border px-3 text-[13px] font-semibold ${where === l.id ? 'border-ink bg-ink text-white' : 'border-line text-steel'}`}
          >
            {l.name}
          </button>
        ))}
      </div>

      <ul className="mt-3 grid gap-2 sm:hidden">
        {stock.map((p) => (
          <li key={p.sku} className="rounded-lg border border-line p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[14px] font-semibold">
                  {p.name} {low(p) && <AlertTriangle size={13} className="-mt-0.5 inline text-alert" aria-label="Below minimum" />}
                </p>
                <p className="text-[12px] text-steel">{p.fits}</p>
              </div>
              <button onClick={() => transfer(p.sku)} className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-md border border-line px-2.5 text-[12px] font-semibold">
                <ArrowRightLeft size={13} /> Send to van
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {cols.map((c) => (
                <span key={c.id} className={`nums rounded-md px-2 py-1 text-[12px] ${p.stock[c.id] === 0 ? 'bg-alert-wash text-alert' : 'bg-paper'}`}>
                  {c.name}: <b>{p.stock[c.id]}</b>
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-3 hidden overflow-x-auto rounded-lg border border-line sm:block">
        <table className="w-full min-w-[620px] text-[13px]">
          <thead className="bg-paper text-left text-steel">
            <tr>
              <th className="px-3 py-2 font-semibold">Part</th>
              {cols.map((c) => (
                <th key={c.id} className="px-2 py-2 text-right font-semibold">
                  {c.name}
                </th>
              ))}
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {stock.map((p) => (
              <tr key={p.sku}>
                <td className="px-3 py-2">
                  <p className="font-semibold">
                    {p.name} {low(p) && <AlertTriangle size={13} className="-mt-0.5 inline text-alert" aria-label="Below minimum" />}
                  </p>
                  <p className="text-[12px] text-steel">
                    {p.sku}, {p.fits}
                  </p>
                </td>
                {cols.map((c) => (
                  <td key={c.id} className={`nums px-2 py-2 text-right ${p.stock[c.id] === 0 ? 'text-alert' : ''}`}>
                    {p.stock[c.id]}
                  </td>
                ))}
                <td className="px-3 py-2 text-right">
                  <button onClick={() => transfer(p.sku)} className="inline-flex min-h-9 items-center gap-1 rounded-md border border-line px-2.5 text-[12px] font-semibold hover:border-ink">
                    <ArrowRightLeft size={13} /> Send to van
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {moved && (
        <p role="status" className="slide-in mt-2 rounded-lg bg-ok-wash px-3 py-2 text-[13px] text-ok">
          {moved}
        </p>
      )}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <h5 className="text-[14px] font-bold">Lost and missing items</h5>
          <ul className="mt-2 grid gap-1.5 text-[13px]">
            {lostItems.map((l) => (
              <li key={l.item} className="flex items-center justify-between gap-2 rounded-md bg-paper px-2.5 py-2">
                <span>
                  <span className="font-semibold">{l.item}</span>
                  <span className="text-steel">, {l.who}, {l.when}</span>
                </span>
                <Pill tone={l.status === 'Found at job site' ? 'ok' : 'alert'}>{l.status}</Pill>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="flex items-center gap-2 text-[14px] font-bold">
            <Truck size={16} /> Vans
          </h5>
          <ul className="mt-2 grid gap-1.5 text-[13px]">
            {vehicles.map((v) => (
              <li key={v.name} className="flex items-center justify-between gap-2 rounded-md bg-paper px-2.5 py-2">
                <span>
                  <span className="font-semibold">{v.name}</span>
                  <span className="text-steel">, {v.driver}, <span className="nums">{v.miles}</span> mi</span>
                </span>
                <Pill tone={v.flag ? 'alert' : 'plain'}>{v.next}</Pill>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Forms() {
  const [view, setView] = useState<'before' | 'after'>('before')
  return (
    <div>
      <div className="mb-4 inline-flex rounded-xl border border-line bg-paper p-1" role="tablist">
        {(['before', 'after'] as const).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => {
              setView(v)
              track('demo_interact', { demo: 'ops', formsView: v })
            }}
            className={`min-h-10 rounded-lg px-3 text-[13px] font-semibold sm:px-4 sm:text-[14px] ${view === v ? 'bg-ink text-white' : 'text-steel'}`}
          >
            {v === 'before' ? 'How it usually looks' : 'How we’d build it'}
          </button>
        ))}
      </div>
      {view === 'before' ? <FormsBefore onFix={() => setView('after')} /> : <FormsAfter />}
      <OtherFormsGrid />
    </div>
  )
}

function FormsBefore({ onFix }: { onFix: () => void }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="slide-in overflow-hidden rounded-xl border border-line">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-paper px-3 py-2.5 sm:px-4">
        <p className="text-[14px] font-bold">Form submissions</p>
        <Pill tone="plain">182 training reports</Pill>
      </div>
      <ul className="divide-y divide-line">
        {beforeSubmissions.map((s, i) => (
          <li key={`${s.date}-${s.who}-${i}`}>
            <button
              type="button"
              onClick={() => {
                if (i === 0) setOpen((o) => !o)
                track('demo_interact', { demo: 'ops', action: 'forms_before_row' })
              }}
              className="flex min-h-12 w-full flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2.5 text-left text-[13px] sm:px-4"
            >
              <span className="nums w-14 shrink-0 text-steel">{s.date}</span>
              <span className="w-20 shrink-0 font-semibold sm:w-24">{s.store}</span>
              <span className="min-w-0 flex-1 truncate">{s.who}</span>
              <span className="hidden text-steel sm:inline">{s.type}</span>
              <span className="text-[12px] font-semibold text-form">{i === 0 && open ? 'Hide' : 'View details'}</span>
            </button>
            {i === 0 && open && (
              <div className="border-t border-dashed border-line bg-paper/80 px-3 py-3 sm:px-4">
                <p className="text-[12px] font-semibold text-steel">Skill ratings (raw text)</p>
                <pre className="mt-1 overflow-x-auto rounded-md bg-white p-2.5 font-sans text-[12px] leading-relaxed text-ink/80 whitespace-pre-wrap">
                  {`Punctuality: 5
Customer communication: 4
Diagnostics: 3
Refrigeration (sealed system): 3
Parts from truck stock: 4
Safety and PPE: 5`}
                </pre>
                <p className="mt-3 text-[14px] text-ink/85">
                  Someone has to open each one. Kevin’s sealed-system score dropped two weeks ago. Nobody noticed.
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="border-t border-line px-3 py-3 sm:px-4">
        <button
          type="button"
          onClick={() => {
            onFix()
            track('demo_interact', { demo: 'ops', formsView: 'after' })
          }}
          className="min-h-11 w-full rounded-lg bg-form px-4 text-[14px] font-semibold text-white sm:w-auto"
        >
          See how we’d build it
        </button>
      </div>
    </div>
  )
}

function OtherFormsGrid() {
  return (
    <div className="mt-6">
      <h5 className="text-[14px] font-bold">What happens after, for the other forms</h5>
      <p className="mt-1 text-[13px] text-steel">Same idea: every form ends in a decision, a task or a number.</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {otherForms.map((f) => (
          <li key={f.name} className="rounded-lg border border-line p-3">
            <p className="text-[14px] font-bold">{f.name}</p>
            <p className="mt-2 text-[12px] font-semibold text-steel">Before</p>
            <p className="text-[13px] text-ink/80">{f.before}</p>
            <p className="mt-2 text-[12px] font-semibold text-form">After</p>
            <p className="text-[13px] text-ink/80">{f.after}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

const flow: Ticket['status'][] = ['New', 'Assigned', 'Waiting on part', 'Resolved']

function Support() {
  const [list, setList] = useState(initialTickets)
  function advance(id: string) {
    setList((ts) =>
      ts.map((t) => {
        if (t.id !== id) return t
        const next = flow[Math.min(flow.indexOf(t.status) + 1, flow.length - 1)]
        return { ...t, status: next, owner: t.owner ?? 'Marcus Reed' }
      }),
    )
  }
  return (
    <div className="slide-in">
      <p className="text-[14px] text-steel">Every complaint and callback has an owner and a status, so nothing gets forgotten in someone’s texts.</p>
      <ul className="mt-3 grid gap-2">
        {list.map((t) => (
          <li key={t.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-line p-3">
            <span className="nums w-12 shrink-0 text-[13px] font-semibold text-steel">{t.id}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold">{t.issue}</p>
              <p className="text-[12px] text-steel">
                {t.customer}, opened {t.age} ago{t.owner ? `, handled by ${t.owner}` : ', nobody assigned'}
              </p>
            </div>
            <Pill tone={t.status === 'New' ? 'alert' : t.status === 'Resolved' ? 'ok' : t.status === 'Waiting on part' ? 'signal' : 'form'}>{t.status}</Pill>
            {t.status !== 'Resolved' && (
              <button onClick={() => advance(t.id)} className="min-h-9 rounded-md border border-line px-3 text-[13px] font-semibold hover:border-ink">
                {t.status === 'New' ? 'Assign' : t.status === 'Assigned' ? 'Waiting on part' : 'Resolve'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
