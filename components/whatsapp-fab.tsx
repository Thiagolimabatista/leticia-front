import { WhatsAppIcon } from '@/components/icons'
import { WHATSAPP_GREETING } from '@/lib/site-config'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import styles from './whatsapp-fab.module.css'

export function WhatsAppFab() {
  return (
    <a
      href={buildWhatsAppLink(WHATSAPP_GREETING)}
      target="_blank"
      rel="noopener noreferrer"
      title="Falar no WhatsApp"
      aria-label="Falar no WhatsApp"
      className={styles.fab}
    >
      <WhatsAppIcon size={30} />
    </a>
  )
}
