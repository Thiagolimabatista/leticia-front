'use client'

import { type FormEvent, useMemo, useState } from 'react'
import { ArrowRightIcon, CheckIcon, SpinnerIcon } from '@/components/icons'
import { SUBJECTS } from '@/lib/faq'
import { WHATSAPP_DISPLAY } from '@/lib/site-config'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import styles from './contact-form.module.css'

type Status = 'idle' | 'sending' | 'sent' | 'error'

interface FormState {
  name: string
  contact: string
  subject: string
  message: string
  website: string
}

const EMPTY_FORM: FormState = {
  name: '',
  contact: '',
  subject: SUBJECTS[0],
  message: '',
  website: '',
}

function buildWhatsAppFallback(form: FormState): string {
  const lines = [
    'Olá! Vim pela Central de Ajuda.',
    form.name ? `Nome: ${form.name}` : '',
    form.contact ? `Contato: ${form.contact}` : '',
    `Assunto: ${form.subject}`,
    form.message ? `Mensagem: ${form.message}` : '',
  ].filter(Boolean)

  return buildWhatsAppLink(lines.join('\n'))
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showErrors, setShowErrors] = useState(false)

  const invalid = useMemo(
    () => ({
      name: form.name.trim().length < 2,
      contact: form.contact.trim().length < 3,
      message: form.message.trim().length < 5,
    }),
    [form.contact, form.message, form.name]
  )

  const whatsAppFallback = useMemo(() => buildWhatsAppFallback(form), [form])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    if (status === 'sent' || status === 'error') setStatus('idle')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (invalid.name || invalid.contact || invalid.message) {
      setShowErrors(true)
      setStatus('error')
      setErrorMessage('Preencha nome, contato e mensagem para a gente conseguir te responder.')
      return
    }

    setShowErrors(false)
    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const payload = (await response.json().catch(() => ({}))) as { error?: string }

      if (!response.ok) {
        setStatus('error')
        setErrorMessage(
          payload.error ??
            'Não conseguimos enviar agora. Tente novamente ou fale com a gente no WhatsApp.'
        )
        return
      }

      setStatus('sent')
      setForm({ ...EMPTY_FORM, subject: form.subject })
    } catch {
      setStatus('error')
      setErrorMessage(
        'Não conseguimos enviar agora. Verifique sua conexão ou fale com a gente no WhatsApp.'
      )
    }
  }

  const isSending = status === 'sending'

  return (
    <section id="fale-com-a-gente" className={styles.section}>
      <div className={styles.head}>
        <p className={styles.eyebrow}>Fale com a gente</p>
        <h2 className={styles.title}>Deixe a sua mensagem</h2>
        <p className={styles.lead}>
          Preencha os campos abaixo. Ao enviar, sua mensagem chega direto na caixa de e-mail da
          loja e a gente responde no contato que você deixar.
        </p>
      </div>

      <form className={styles.panel} onSubmit={handleSubmit} noValidate>
        <div className={styles.row}>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Seu nome"
            aria-label="Seu nome"
            className={`${styles.field} ${showErrors && invalid.name ? styles.fieldInvalid : ''}`}
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
          />
          <input
            type="text"
            name="contact"
            autoComplete="email"
            placeholder="E-mail ou telefone"
            aria-label="E-mail ou telefone"
            className={`${styles.field} ${showErrors && invalid.contact ? styles.fieldInvalid : ''}`}
            value={form.contact}
            onChange={(event) => update('contact', event.target.value)}
          />
        </div>

        <div className={styles.subjectBlock}>
          <p className={styles.subjectLabel}>Assunto</p>
          <div className={styles.subjectRow}>
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                type="button"
                className={`${styles.subject} ${form.subject === subject ? styles.subjectActive : ''}`}
                aria-pressed={form.subject === subject}
                onClick={() => update('subject', subject)}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={5}
          name="message"
          placeholder="Conte pra gente o que aconteceu — se tiver o número do pedido, já ajuda bastante."
          aria-label="Sua mensagem"
          className={`${styles.textarea} ${showErrors && invalid.message ? styles.fieldInvalid : ''}`}
          value={form.message}
          onChange={(event) => update('message', event.target.value)}
        />

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className={styles.honeypot}
          value={form.website}
          onChange={(event) => update('website', event.target.value)}
        />

        <button type="submit" className={styles.submit} disabled={isSending}>
          {isSending ? 'Enviando…' : 'Enviar mensagem'}
          {isSending ? <SpinnerIcon className={styles.spinner} /> : <ArrowRightIcon />}
        </button>

        {status === 'sent' && (
          <p className={`${styles.feedback} ${styles.feedbackSuccess}`} role="status">
            <CheckIcon />
            Mensagem enviada. Já chegou na nossa caixa de entrada e respondemos em até 1 dia útil.
          </p>
        )}

        {status === 'error' && (
          <p className={`${styles.feedback} ${styles.feedbackError}`} role="alert">
            {errorMessage}
          </p>
        )}

        <p className={styles.footnote}>
          {WHATSAPP_DISPLAY} · resposta em até 1h útil no horário comercial
        </p>

        <p className={styles.altLine}>
          Prefere o WhatsApp?{' '}
          <a
            href={whatsAppFallback}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.altLink}
          >
            Enviar essa mensagem por lá
          </a>
        </p>
      </form>
    </section>
  )
}
