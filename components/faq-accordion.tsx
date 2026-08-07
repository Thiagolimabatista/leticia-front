'use client'

import type { RefObject } from 'react'
import { FAQ } from '@/lib/faq'
import styles from './faq-accordion.module.css'

interface FaqAccordionProps {
  openIndex: number | null
  onToggle: (index: number) => void
  sectionRef: RefObject<HTMLElement | null>
}

export function FaqAccordion({ openIndex, onToggle, sectionRef }: FaqAccordionProps) {
  return (
    <section ref={sectionRef} id="duvidas-frequentes" className={styles.section}>
      <p className={styles.eyebrow}>Dúvidas frequentes</p>
      <h2 className={styles.title}>As respostas que mais procuram</h2>

      <div className={styles.list}>
        {FAQ.map((entry, index) => {
          const isOpen = openIndex === index
          const panelId = `faq-panel-${index}`

          return (
            <div key={entry.q} className={styles.item}>
              <button
                type="button"
                className={styles.trigger}
                onClick={() => onToggle(index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className={styles.question}>{entry.q}</span>
                <span className={styles.sign} aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <p id={panelId} className={styles.answer}>
                  {entry.a}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
