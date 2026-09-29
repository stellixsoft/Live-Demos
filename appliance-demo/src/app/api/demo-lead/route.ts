import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'
import { buildQuoteEmail } from '@/lib/quoteEmail'
import { validateName, validatePhone } from '@/lib/validate'

export const runtime = 'nodejs'

type DemoLeadBody = {
  name?: string
  email?: string
  phone?: string
  business?: string
  note?: string
  interests?: string[]
  source?: string
  page?: string
  website?: string // honeypot
}

function requiredEnv(name: string): string {
  let value = process.env[name]?.trim() ?? ''
  // Strip wrapping quotes from .env values like SMTP_FROM="Name <a@b.com>"
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim()
  }
  if (!value) throw new Error(`Missing env: ${name}`)
  return value
}

export async function POST(request: Request) {
  let body: DemoLeadBody
  try {
    body = (await request.json()) as DemoLeadBody
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 })
  }

  // Honeypot — bots fill this; humans never see it.
  if (body.website?.trim()) {
    return NextResponse.json({ success: true, message: "Thanks! We'll be in touch within 1 business day." })
  }

  const name = body.name?.trim() ?? ''
  const email = body.email?.trim() ?? ''
  const phone = body.phone?.trim() ?? ''

  if (!name || !email || !phone) {
    return NextResponse.json(
      { success: false, message: 'Name, email, and phone are required.' },
      { status: 400 },
    )
  }

  const nameError = validateName(name)
  if (nameError) {
    return NextResponse.json({ success: false, message: nameError }, { status: 400 })
  }

  const phoneError = validatePhone(phone)
  if (phoneError) {
    return NextResponse.json({ success: false, message: phoneError }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, message: 'Please enter a valid email address.' }, { status: 400 })
  }

  const business = body.business?.trim() ?? ''
  const note = body.note?.trim() ?? ''
  const interests = Array.isArray(body.interests) ? body.interests.filter(Boolean).map(String) : []
  const source = body.source?.trim() || 'appliance-demo'
  const page = (body.page ?? '').slice(0, 500)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'this demo'

  try {
    const host = requiredEnv('SMTP_HOST')
    const port = Number(process.env.SMTP_PORT || '587')
    const user = requiredEnv('SMTP_USER')
    const pass = requiredEnv('SMTP_PASS')
    const from = requiredEnv('SMTP_FROM')
    const to = requiredEnv('EMAIL_TO')

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    const { subject, text, html } = buildQuoteEmail({
      name,
      email,
      phone,
      business,
      note,
      interests,
      source,
      page,
      siteUrl,
    })

    const info = await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject,
      text,
      html,
    })

    console.log('[demo-lead] sent', {
      to,
      accepted: info.accepted,
      rejected: info.rejected,
      messageId: info.messageId,
      response: info.response,
    })

    return NextResponse.json({
      success: true,
      message: "Thanks! We'll be in touch within 1 business day.",
    })
  } catch (err) {
    console.error('[demo-lead]', err)
    return NextResponse.json(
      {
        success: false,
        message: 'We could not deliver your message. Please email sales@stellixsoft.com or try again.',
      },
      { status: 500 },
    )
  }
}
