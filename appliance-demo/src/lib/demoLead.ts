import { company } from '@/config'

export type DemoLeadPayload = {
  name: string
  email: string
  phone: string
  business?: string
  note?: string
  interests?: string[]
  source?: string
  page?: string
  website?: string // honeypot — leave empty
}

export type DemoLeadResult = {
  ok: boolean
  message: string
}

/** Posts the quote form to stellixsoft.com (same SMTP inbox as the main contact form). */
export async function submitDemoLead(payload: DemoLeadPayload): Promise<DemoLeadResult> {
  try {
    const res = await fetch(company.demoLeadUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        source: payload.source ?? 'appliance-demo',
        page: payload.page ?? (typeof window !== 'undefined' ? window.location.href.slice(0, 500) : ''),
      }),
    })
    const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string }
    if (!res.ok || !data.success) {
      return {
        ok: false,
        message:
          data.message ||
          'We could not deliver your message. Please email sales@stellixsoft.com or try again.',
      }
    }
    return {
      ok: true,
      message: data.message || "Thanks! We'll be in touch within 1 business day.",
    }
  } catch {
    return {
      ok: false,
      message:
        'We could not reach the server. Please email sales@stellixsoft.com or try again.',
    }
  }
}
