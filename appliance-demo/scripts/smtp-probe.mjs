import fs from 'fs'
import nodemailer from 'nodemailer'

const env = Object.fromEntries(
  fs
    .readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      let v = l.slice(i + 1)
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1)
      }
      return [l.slice(0, i), v]
    }),
)

const port = Number(env.SMTP_PORT || 587)
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  logger: true,
  debug: true,
})

console.log('FROM:', JSON.stringify(env.SMTP_FROM))
console.log('TO:', env.EMAIL_TO)
console.log('HOST:', env.SMTP_HOST, 'PORT:', port)

await transporter.verify()
console.log('VERIFY_OK')

const info = await transporter.sendMail({
  from: env.SMTP_FROM,
  to: env.EMAIL_TO,
  subject: `SMTP direct probe ${new Date().toISOString()}`,
  text: 'Direct nodemailer probe, not via Next API. If you got this, SMTP can reach EMAIL_TO.',
})

console.log('MESSAGE_ID', info.messageId)
console.log('RESPONSE', info.response)
console.log('ACCEPTED', info.accepted)
console.log('REJECTED', info.rejected)
console.log('PENDING', info.pending)
