import { NextResponse } from 'next/server'
import { SUBJECTS } from '@/lib/faq'
import { MailerNotConfiguredError, sendEmail } from '@/lib/mailer'
import { isRateLimited } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ContactPayload {
  name?: unknown
  contact?: unknown
  subject?: unknown
  message?: unknown
  website?: unknown
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function asTrimmedString(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

function buildHtml(fields: {
  name: string
  contact: string
  subject: string
  message: string
  receivedAt: string
}): string {
  const rows = [
    ['Nome', fields.name],
    ['Contato', fields.contact],
    ['Assunto', fields.subject],
    ['Recebido em', fields.receivedAt],
  ]
    .map(
      ([label, value]) =>
        `<tr>
           <td style="padding:8px 16px 8px 0;color:#8c6b57;font-size:11px;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
           <td style="padding:8px 0;color:#1a1a1a;font-size:14px;">${escapeHtml(value)}</td>
         </tr>`
    )
    .join('')

  return `<div style="margin:0;padding:32px;background:#f0e9e3;font-family:Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #ebe6e1;padding:32px;">
    <p style="margin:0 0 6px;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#8c6b57;">Central de ajuda</p>
    <h1 style="margin:0 0 24px;font-size:22px;font-weight:400;color:#1a1a1a;">Nova mensagem do site</h1>
    <table style="width:100%;border-collapse:collapse;">${rows}</table>
    <div style="margin-top:24px;padding-top:24px;border-top:1px solid #ededed;">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8c6b57;">Mensagem</p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#4a4540;white-space:pre-wrap;">${escapeHtml(fields.message)}</p>
    </div>
  </div>
</div>`
}

export async function POST(request: Request) {
  let body: ContactPayload

  try {
    body = (await request.json()) as ContactPayload
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 })
  }

  /** Honeypot: bots fill hidden fields, so accept silently and drop the message. */
  if (asTrimmedString(body.website, 200).length > 0) {
    return NextResponse.json({ ok: true })
  }

  const name = asTrimmedString(body.name, 120)
  const contact = asTrimmedString(body.contact, 160)
  const message = asTrimmedString(body.message, 5000)
  const requestedSubject = asTrimmedString(body.subject, 80)
  const subject = SUBJECTS.includes(requestedSubject) ? requestedSubject : SUBJECTS[0]

  if (name.length < 2 || contact.length < 3 || message.length < 5) {
    return NextResponse.json(
      { error: 'Preencha nome, contato e mensagem para a gente conseguir te responder.' },
      { status: 400 }
    )
  }

  if (isRateLimited(clientKey(request))) {
    return NextResponse.json(
      { error: 'Muitas mensagens seguidas. Aguarde alguns minutos e tente de novo.' },
      { status: 429 }
    )
  }

  const receivedAt = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date())

  const text = [
    'Nova mensagem pela Central de Ajuda',
    '',
    `Nome: ${name}`,
    `Contato: ${contact}`,
    `Assunto: ${subject}`,
    `Recebido em: ${receivedAt}`,
    '',
    'Mensagem:',
    message,
  ].join('\n')

  try {
    await sendEmail({
      subject: `[Central de Ajuda] ${subject} — ${name}`,
      text,
      html: buildHtml({ name, contact, subject, message, receivedAt }),
      replyTo: EMAIL_PATTERN.test(contact) ? contact : undefined,
    })
  } catch (error) {
    if (error instanceof MailerNotConfiguredError) {
      console.error('[contact] provedor de e-mail não configurado', error)
      return NextResponse.json(
        { error: 'O envio de e-mail ainda não foi configurado neste site.' },
        { status: 503 }
      )
    }

    console.error('[contact] falha ao enviar e-mail', error)
    return NextResponse.json(
      { error: 'Não conseguimos enviar agora. Tente novamente em instantes.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
