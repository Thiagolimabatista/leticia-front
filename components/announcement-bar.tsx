import styles from './announcement-bar.module.css'

const MESSAGES = [
  'Atendimento de segunda a sexta, das 9h às 18h',
  'Frete grátis acima de R$499',
  '5% OFF nos pagamentos por Pix',
  '10% OFF na primeira compra com o cupom BEMVINDA',
] as const

export function AnnouncementBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.track}>
        {[...MESSAGES, ...MESSAGES].map((message, index) => (
          <span key={`${message}-${index}`} aria-hidden={index >= MESSAGES.length}>
            {message}
          </span>
        ))}
      </div>
    </div>
  )
}
