import type { ReactNode } from 'react'

export function SampleBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-0.5 text-[12px] font-medium text-steel ${className}`}
      title="Invented data, shown for demonstration"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
      Sample data
    </span>
  )
}

export function Pill({ tone = 'plain', children }: { tone?: 'plain' | 'ok' | 'alert' | 'signal' | 'form'; children: ReactNode }) {
  const tones = {
    plain: 'bg-paper text-steel border-line',
    ok: 'bg-ok-wash text-ok border-transparent',
    alert: 'bg-alert-wash text-alert border-transparent',
    signal: 'bg-signal-wash text-[#7a5b00] border-transparent',
    form: 'bg-form-wash text-form-deep border-transparent',
  }
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[12px] font-semibold whitespace-nowrap ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Button({
  children,
  onClick,
  href,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'ghost' | 'dark'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  const styles = {
    primary: 'bg-form text-white hover:bg-form-deep',
    dark: 'bg-ink text-white hover:bg-black',
    ghost: 'bg-white text-ink border border-line hover:border-ink',
  }
  const cls = `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`
  if (href)
    return (
      <a href={href} onClick={onClick} className={cls} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        {children}
      </a>
    )
  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {children}
    </button>
  )
}

/** A phone outline used for customer-facing demos. */
export function Phone({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="mx-auto w-full max-w-[330px]">
      <div className="rounded-[34px] border-[7px] border-ink bg-ink shadow-[0_20px_40px_-20px_rgba(20,32,43,0.45)]">
        <div className="relative overflow-hidden rounded-[27px] bg-white">
          <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[11px] font-semibold text-ink">
            <span className="nums">9:41</span>
            <span className="h-4 w-16 rounded-full bg-ink" aria-hidden />
            <span aria-hidden>5G</span>
          </div>
          <div className="h-[540px] overflow-y-auto no-scrollbar">{children}</div>
        </div>
      </div>
      {label && <p className="mt-3 text-center text-[13px] text-steel">{label}</p>}
    </div>
  )
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  dark = false,
}: {
  tabs: { id: T; label: string; count?: number }[]
  value: T
  onChange: (v: T) => void
  dark?: boolean
}) {
  return (
    <div role="tablist" className="flex gap-1 overflow-x-auto no-scrollbar">
      {tabs.map((t) => {
        const on = t.id === value
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t.id)}
            className={`flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3.5 text-[14px] font-semibold transition-colors ${
              dark
                ? on
                  ? 'bg-white text-ink'
                  : 'text-white/70 hover:text-white'
                : on
                  ? 'bg-ink text-white'
                  : 'text-steel hover:text-ink'
            }`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className={`nums rounded-full px-1.5 text-[11px] ${on ? 'bg-signal text-ink' : 'bg-alert text-white'}`}>{t.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function money(n: number) {
  return '$' + n.toLocaleString('en-US')
}
