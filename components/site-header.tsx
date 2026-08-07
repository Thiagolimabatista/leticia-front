import { LOGO_URL, SITE_URL } from '@/lib/site-config'
import styles from './site-header.module.css'

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className={styles.logoLink}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_URL} alt="LILA BRAND" className={styles.logo} />
      </a>
      <span className={styles.tag}>Central de ajuda</span>
    </header>
  )
}
