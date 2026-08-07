import nodemailer from 'nodemailer'
import { CONTACT_INBOX } from '@/lib/site-config'

/** Thrown when neither Resend nor SMTP credentials are present in the environment. */
export class MailerNotConfiguredError extends Error {
  constructor() {
    super('Nenhum provedor de e-mail configurado (RESEND_API_KEY ou SMTP_*).')
    this.name = 'MailerNotConfiguredError'
  }
}

export interface OutgoingEmail {
  subject: string
  text: string
  html: string
  replyTo?: string
}

function recipient(): string {
  return process.env.CONTACT_TO_EMAIL?.trim() || CONTACT_INBOX
}

async function sendWithResend(email: OutgoingEmail, apiKey: string): Promise<void> {
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || 'Central de Ajuda <onboarding@resend.dev>'

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [recipient()],
      subject: email.subject,
      text: email.text,
      html: email.html,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Resend respondeu ${response.status}: ${detail}`)
  }
}

async function sendWithSmtp(email: OutgoingEmail): Promise<void> {
  const host = process.env.SMTP_HOST as string
  const user = process.env.SMTP_USER as string
  const pass = process.env.SMTP_PASS as string
  const port = Number(process.env.SMTP_PORT ?? 465)

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  await transporter.sendMail({
    from: process.env.CONTACT_FROM_EMAIL?.trim() || `Central de Ajuda <${user}>`,
    to: recipient(),
    subject: email.subject,
    text: email.text,
    html: email.html,
    replyTo: email.replyTo,
  })
}

/**
 * Delivers a transactional email using Resend when `RESEND_API_KEY` is set,
 * falling back to SMTP when `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` are present.
 */
export async function sendEmail(email: OutgoingEmail): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY?.trim()
  if (resendKey) {
    await sendWithResend(email, resendKey)
    return
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    await sendWithSmtp(email)
    return
  }

  throw new MailerNotConfiguredError()
}
