'use client'

import { useState } from 'react'
import { Bell, Check, CheckSquare, ClipboardList, Square, X } from 'lucide-react'
import { Pill, Tabs, money } from '../ui'
import { track } from '@/lib/firebase'

type Role = 'owner' | 'manager' | 'tech'

interface Request {
  id: number
  who: string
  what: string
  amount: number
  kind: 'Part' | 'Leave' | 'Refund'
}

const LIMIT = 150 // managers approve under this, above goes to the owner

const initialRequests: Request[] = [
  { id: 1, who: 'Kevin Lam', what: 'Pair of cables and drums for Okafor job', amount: 64, kind: 'Part' },
  { id: 2, who: 'Dana Ortiz', what: 'LiftMaster opener for Nguyen install', amount: 389, kind: 'Part' },
  { id: 3, who: 'Office', what: 'Refund for service call, J. Alvarez', amount: 79, kind: 'Refund' },
]

export function SheetsDemo() {
  const [view, setView] = useState<'before' | 'after'>('before')
  return (
    <div>
      <div className="mb-4 inline-flex rounded-xl border border-line bg-white p-1" role="tablist">
        {(['before', 'after'] as const).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => {
              setView(v)
              track('demo_interact', { demo: 'sheets', view: v })
            }}
            className={`min-h-10 rounded-lg px-4 text-[14px] font-semibold ${view === v ? 'bg-ink text-white' : 'text-steel'}`}
          >
            {v === 'before' ? 'Your sheet today' : 'The same data as an app'}
          </button>
        ))}
      </div>
      {view === 'before' ? <Spreadsheet onFix={() => setView('after')} /> : <App />}
    </div>
  )
}

function Spreadsheet({ onFix }: { onFix: () => void }) {
  const rows = [
    ['9/26', 'Brooks', 'spring broke, car stuck', 'MARCUS', 'done?? pd cash', '329', '#fde68a'],
    ['9/26', 'Nguyen ', 'opener install LM', 'dana', 'DONE', '612', '#bbf7d0'],
    ['9/27', 'Garcia', '16x7 door quote', 'Dana / kevin?', 'quote sent? follow up!!', '', '#fecaca'],
    ['9/27', 'Okafor', 'off track', 'kevin', '', '', ''],
    ['9/27', 'walsh', 'new door install', 'crew 2', 'door ORDERED??? eta', '', '#fecaca'],
    ['9/28', 'Brooks', 'door noisy after repair', 'MARCUS', 'CALLBACK - free', '0', '#fde68a'],
    ['', '', '', '', 'see Springs tab', '', ''],
  ]
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-line bg-[#f8f9fa] px-3 py-2">
        <span className="h-3 w-3 rounded-sm bg-ok" aria-hidden />
        <span className="truncate text-[13px] font-medium">Jobs MASTER FINAL v3 (1) - copy</span>
        <span className="ml-auto shrink-0 text-[12px] text-steel">Last edit by someone, 2 min ago</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-[12.5px]">
          <thead>
            <tr className="bg-[#f8f9fa] text-left text-steel">
              {['', 'A date', 'B customer', 'C job', 'D tech', 'E status', 'F $'].map((h) => (
                <th key={h} className="border border-[#e2e3e5] px-2 py-1 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ background: r[6] || undefined }}>
                <td className="nums border border-[#e2e3e5] bg-[#f8f9fa] px-2 py-1 text-steel">{i + 2}</td>
                {r.slice(0, 6).map((c, j) => (
                  <td key={j} className="border border-[#e2e3e5] px-2 py-1 whitespace-nowrap">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-0.5 overflow-x-auto border-t border-line bg-[#f8f9fa] px-2 text-[12px] no-scrollbar">
        {['Jobs', 'Jobs OLD', 'Springs', 'Door orders', 'Commissions', 'DO NOT DELETE'].map((t, i) => (
          <span key={t} className={`shrink-0 px-3 py-1.5 ${i === 0 ? 'bg-white font-semibold' : 'text-steel'}`}>
            {t}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
        <p className="text-[14px] text-steel">Did anyone follow up the Garcia quote? When does the Walsh door arrive? Nobody gets reminded.</p>
        <button onClick={onFix} className="min-h-10 rounded-lg bg-form px-4 text-[14px] font-semibold text-white">
          Turn it into an app
        </button>
      </div>
    </div>
  )
}

function App() {
  const [role, setRole] = useState<Role>('owner')
  const [requests, setRequests] = useState<Request[]>(initialRequests)
  const [toast, setToast] = useState<string>()
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Upload before and after photos, Brooks springs', done: false, due: 'Today' },
    { id: 2, text: 'Measure the Garcia opening for the door quote', done: false, due: 'Today' },
    { id: 3, text: 'Spring safety refresher, module 2', done: true, due: 'Fri' },
  ])

  const mine = requests.filter((r) => (role === 'owner' ? r.amount >= LIMIT : role === 'manager' ? r.amount < LIMIT : false))

  function decide(r: Request, ok: boolean) {
    setRequests((rs) => rs.filter((x) => x.id !== r.id))
    setToast(`${ok ? 'Approved' : 'Declined'}. ${r.who} gets a notification.`)
    setTimeout(() => setToast(undefined), 2600)
  }

  function requestPart() {
    const id = Date.now()
    setRequests((rs) => [...rs, { id, who: 'Kevin Lam', what: 'Pair of extension springs and safety cables', amount: 58, kind: 'Part' }])
    setToast('Request sent to your manager for approval.')
    setTimeout(() => setToast(undefined), 2600)
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-ink px-4 py-3">
        <p className="text-[14px] font-bold text-white">Signed in as</p>
        <Tabs<Role>
          dark
          value={role}
          onChange={setRole}
          tabs={[
            { id: 'owner', label: 'Owner' },
            { id: 'manager', label: 'Manager' },
            { id: 'tech', label: 'Technician' },
          ]}
        />
      </div>

      <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-[1.2fr_1fr]">
        <div className="min-w-0">
          {role === 'owner' && (
            <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ['Jobs today', '12'],
                ['Unpaid', money(1840)],
                ['Callbacks this week', '2'],
                ['Overdue tasks', '1'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-paper px-3 py-2">
                  <p className="text-[12px] text-steel">{k}</p>
                  <p className="nums text-[20px] font-bold">{v}</p>
                </div>
              ))}
            </div>
          )}

          {role !== 'tech' ? (
            <>
              <h4 className="flex items-center gap-2 text-[15px] font-bold">
                <ClipboardList size={17} /> Waiting for your approval
              </h4>
              <p className="mt-1 text-[13px] text-steel">
                {role === 'owner'
                  ? `Anything over ${money(LIMIT)} comes to you. Smaller requests stop at the manager.`
                  : `You approve requests under ${money(LIMIT)}. Bigger ones go to the owner automatically.`}
              </p>
              <ul className="mt-3 grid gap-2">
                {mine.length === 0 && <li className="rounded-lg border border-dashed border-line p-4 text-[14px] text-steel">Nothing waiting. Switch to Technician and request a part.</li>}
                {mine.map((r) => (
                  <li key={r.id} className="slide-in flex flex-wrap items-center gap-3 rounded-lg border border-line p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold">{r.what}</p>
                      <p className="text-[13px] text-steel">
                        {r.kind} request from {r.who}, <span className="nums">{money(r.amount)}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => decide(r, false)} aria-label="Decline" className="flex h-10 w-10 items-center justify-center rounded-lg border border-line hover:border-alert">
                        <X size={17} />
                      </button>
                      <button onClick={() => decide(r, true)} className="flex min-h-10 items-center gap-1.5 rounded-lg bg-ok px-3 text-[14px] font-semibold text-white">
                        <Check size={16} /> Approve
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h4 className="text-[15px] font-bold">My tasks</h4>
              <ul className="mt-3 grid gap-2">
                {tasks.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                      className="flex min-h-12 w-full items-center gap-3 rounded-lg border border-line px-3 text-left"
                    >
                      {t.done ? <CheckSquare size={19} className="shrink-0 text-ok" /> : <Square size={19} className="shrink-0 text-steel" />}
                      <span className={`flex-1 text-[14px] ${t.done ? 'text-steel line-through' : ''}`}>{t.text}</span>
                      <Pill tone={t.due === 'Today' && !t.done ? 'signal' : 'plain'}>{t.due}</Pill>
                    </button>
                  </li>
                ))}
              </ul>
              <button onClick={requestPart} className="mt-4 min-h-11 w-full rounded-lg bg-form text-[14px] font-semibold text-white">
                Request a part ($58 extension springs)
              </button>
              <p className="mt-2 text-[13px] text-steel">Kevin only sees his own jobs and tasks. No prices, no other technicians’ pay.</p>
            </>
          )}
        </div>

        <div className="min-w-0">
          <h4 className="flex items-center gap-2 text-[15px] font-bold">
            <Bell size={17} /> Reminders and alerts
          </h4>
          <ul className="mt-3 grid gap-2 text-[14px]">
            {(role === 'tech'
              ? [
                  ['signal', 'Next job in 25 min: Okafor, door off track'],
                  ['plain', 'Photos missing on job #2231'],
                  ['plain', 'Van stock check due Friday'],
                ]
              : role === 'manager'
                ? [
                    ['alert', 'Walsh job has no technician assigned'],
                    ['signal', '0.250 torsion springs below minimum on 2 vans'],
                    ['plain', 'Dana’s leave request: Oct 9 to 10'],
                  ]
                : [
                    ['alert', 'Callback: Brooks door noisy after repair (Marcus)'],
                    ['signal', 'Van 4 brake check overdue'],
                    ['plain', '4 new door quotes waiting over 3 days, follow-ups sent'],
                  ]
            ).map(([tone, text]) => (
              <li key={text} className="flex items-start gap-2.5 rounded-lg bg-paper px-3 py-2.5">
                <span
                  className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${tone === 'alert' ? 'bg-alert' : tone === 'signal' ? 'bg-signal' : 'bg-steel/40'}`}
                  aria-hidden
                />
                {text}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-steel">Everyone gets reminded on their phone. Nothing depends on someone opening the sheet.</p>
        </div>
      </div>

      {toast && (
        <div role="status" className="slide-in absolute right-4 bottom-4 left-4 rounded-lg bg-ink px-4 py-3 text-[14px] text-white sm:left-auto">
          {toast}
        </div>
      )}
    </div>
  )
}
