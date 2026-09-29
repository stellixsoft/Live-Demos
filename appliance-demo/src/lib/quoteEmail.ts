import { sectionMeta, type SectionId } from '@/lib/flow'

export type QuoteEmailData = {
  name: string
  email: string
  phone: string
  business?: string
  note?: string
  interests: string[]
  source: string
  page?: string
  siteUrl: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function interestLabel(id: string): string {
  return sectionMeta[id as SectionId]?.nav ?? id
}

function fieldRow(label: string, value: string, last = false): string {
  const border = last ? '' : 'border-bottom:1px solid #eceff3;'
  return `
    <tr>
      <td style="padding:12px 0;${border};width:120px;vertical-align:top;font-size:13px;font-weight:600;color:#6b7280;font-family:Arial,Helvetica,sans-serif">
        ${escapeHtml(label)}
      </td>
      <td style="padding:12px 0;${border};vertical-align:top;font-size:15px;color:#111827;font-family:Arial,Helvetica,sans-serif">
        ${value}
      </td>
    </tr>`
}

export function buildQuoteEmail(data: QuoteEmailData): { subject: string; text: string; html: string } {
  const business = data.business?.trim() || ''
  const note = data.note?.trim() || ''
  const page = data.page?.trim() || ''
  const interestLabels = data.interests.map(interestLabel)
  const interestLine = interestLabels.length ? interestLabels.join(', ') : 'None selected'
  const interestHtml = interestLabels.length
    ? interestLabels
        .map(
          (label) =>
            `<span style="display:inline-block;margin:0 6px 6px 0;padding:4px 10px;border-radius:999px;background:#eef2ff;color:#2446c9;font-size:13px;font-weight:600;font-family:Arial,Helvetica,sans-serif">${escapeHtml(label)}</span>`,
        )
        .join('')
    : `<span style="color:#6b7280;font-size:15px;font-family:Arial,Helvetica,sans-serif">None selected</span>`

  const subject = business
    ? `New quote request — ${business}`
    : `New quote request — ${data.name}`

  const text = [
    'New quote request from the appliance repair demo',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    business && `Business: ${business}`,
    `Interests: ${interestLine}`,
    note && `Note: ${note}`,
    `Source: ${data.source}`,
    page && `Page: ${page}`,
    `Site: ${data.siteUrl}`,
  ]
    .filter(Boolean)
    .join('\n')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
          <tr>
            <td style="background:#2446c9;padding:20px 24px">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#c7d2fe">
                StellixSoft
              </p>
              <h1 style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.3;font-weight:700;color:#ffffff">
                New quote request
              </h1>
              <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#dbeafe">
                Appliance repair demo · reply to contact them
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 4px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${fieldRow('Name', escapeHtml(data.name))}
                ${fieldRow(
                  'Email',
                  `<a href="mailto:${escapeHtml(data.email)}" style="color:#2446c9;text-decoration:none">${escapeHtml(data.email)}</a>`,
                )}
                ${fieldRow(
                  'Phone',
                  `<a href="tel:${escapeHtml(data.phone.replace(/[^+\d]/g, ''))}" style="color:#2446c9;text-decoration:none">${escapeHtml(data.phone)}</a>`,
                )}
                ${business ? fieldRow('Business', escapeHtml(business)) : ''}
                ${fieldRow('Interests', interestHtml)}
                ${note ? fieldRow('Note', escapeHtml(note).replace(/\n/g, '<br />')) : ''}
                ${fieldRow('Source', escapeHtml(data.source), !page)}
                ${
                  page
                    ? fieldRow(
                        'Page',
                        `<a href="${escapeHtml(page)}" style="color:#2446c9;text-decoration:none;word-break:break-all">${escapeHtml(page)}</a>`,
                        true,
                      )
                    : ''
                }
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 24px">
              <p style="margin:0;padding:12px 14px;border-radius:8px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#6b7280">
                Hit reply to email ${escapeHtml(data.name)} directly.
                ${data.siteUrl ? `<br />Site: ${escapeHtml(data.siteUrl)}` : ''}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject, text, html }
}
