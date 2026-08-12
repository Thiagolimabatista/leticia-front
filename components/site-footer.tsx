import {
  ADDRESS_LINES,
  BUSINESS_HOURS,
  LOGO_URL,
  WHATSAPP_DISPLAY,
  WHATSAPP_GREETING,
} from '@/lib/site-config'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { Fragment } from 'react'
import styles from './site-footer.module.css'

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_URL} alt="LILA BRAND" className={styles.logo} />
        <p className={styles.address}>
          {ADDRESS_LINES.map((line, index) => (
            <Fragment key={line}>
              {index > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </p>
      </div>
      <div className={styles.contact}>
        <a href={buildWhatsAppLink(WHATSAPP_GREETING)} target="_blank" rel="noopener noreferrer">
          WhatsApp {WHATSAPP_DISPLAY}
        </a>
        <span className={styles.hours}>{BUSINESS_HOURS}</span>
      </div>
    </footer>
  )
}
