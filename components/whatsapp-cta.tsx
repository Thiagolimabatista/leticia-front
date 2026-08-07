import { WhatsAppIcon } from '@/components/icons'
import { WHATSAPP_GREETING } from '@/lib/site-config'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import styles from './whatsapp-cta.module.css'

export function WhatsAppCta() {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.blob} aria-hidden="true" />
        <div className={styles.copy}>
          <h2 className={styles.title}>Prefere resolver falando?</h2>
          <p className={styles.text}>
            Nossa equipe atende no WhatsApp em minutos durante o horário comercial. Sem robô, sem
            espera.
          </p>
        </div>
        <a
          href={buildWhatsAppLink(WHATSAPP_GREETING)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.button}
        >
          <WhatsAppIcon />
          Falar agora
        </a>
      </div>
    </section>
  )
}
