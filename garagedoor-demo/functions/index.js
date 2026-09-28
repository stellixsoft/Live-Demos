// OPTIONAL. Sends you a message whenever a prospect finishes the questions,
// clicks "Email us your sheet", or asks for a call.
// Needs the Blaze (pay as you go) plan. At this volume it should cost nothing.
//
// Set the webhook once:  firebase functions:secrets:set NOTIFY_WEBHOOK_URL
// Works with a Slack or Discord incoming webhook, or a Make / Zapier webhook
// that forwards to email or WhatsApp.

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { defineSecret } = require('firebase-functions/params')
const logger = require('firebase-functions/logger')

const NOTIFY_WEBHOOK_URL = defineSecret('NOTIFY_WEBHOOK_URL')

const labels = {
  quiz_completed: 'finished the questions',
  cta_click: 'clicked a button',
  sheet_offer: 'wants to send a sheet',
  contact_form: 'asked for a call',
}

exports.notifyOnLead = onDocumentCreated(
  { document: 'leads/{leadId}', secrets: [NOTIFY_WEBHOOK_URL] },
  async (event) => {
    const d = event.data?.data()
    if (!d) return
    const a = d.answers || {}
    const lines = [
      `${d.business || 'Someone'}${d.city ? ` (${d.city})` : ''} ${labels[d.kind] || d.kind}`,
      a.size && `Team: ${a.size}`,
      a.problem && `Biggest problem: ${a.problem}`,
      a.tracking && `Runs on: ${a.tracking}`,
      a.cracks && a.cracks.length && `Gaps: ${a.cracks.join(', ')}`,
      d.interests && d.interests.length && `Wants a quote for: ${d.interests.join(', ')}`,
      d.name && `Name: ${d.name}`,
      d.phone && `Phone: ${d.phone}`,
      d.note && `Note: ${d.note}`,
    ].filter(Boolean)
    const text = lines.join('\n')

    const res = await fetch(NOTIFY_WEBHOOK_URL.value(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // "text" works for Slack, "content" for Discord; Make/Zapier receive every field.
      body: JSON.stringify({ text, content: text, ...d, createdAt: undefined }),
    })
    if (!res.ok) logger.warn('Webhook failed', res.status, await res.text())
  },
)
