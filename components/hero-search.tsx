'use client'

import type { ChangeEvent, KeyboardEvent } from 'react'
import { SearchIcon } from '@/components/icons'
import { CHIPS } from '@/lib/faq'
import type { SearchResult } from '@/lib/search'
import styles from './hero-search.module.css'

interface HeroSearchProps {
  query: string
  results: SearchResult[]
  isTyping: boolean
  whatsAppLink: string
  onQueryChange: (value: string) => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  onResultSelect: (result: SearchResult) => void
}

export function HeroSearch({
  query,
  results,
  isTyping,
  whatsAppLink,
  onQueryChange,
  onKeyDown,
  onResultSelect,
}: HeroSearchProps) {
  const hasResults = isTyping && results.length > 0
  const noResults = isTyping && results.length === 0

  return (
    <section className={styles.hero}>
      <div className={styles.blobA} aria-hidden="true" />
      <div className={styles.blobB} aria-hidden="true" />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>Estamos por aqui</p>
        <h1 className={styles.title}>
          Como podemos <em>ajudar você?</em>
        </h1>
        <p className={styles.subtitle}>
          Busque a sua dúvida abaixo ou deixe uma mensagem no formulário. Nossa equipe responde de
          segunda a sexta, das 9h às 18h.
        </p>

        <div className={styles.searchWrap}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar: prazo de entrega, troca, frete, Pix, tamanho…"
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onQueryChange(event.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Buscar na central de ajuda"
          />

          {hasResults && (
            <div className={styles.panel} role="listbox">
              {results.map((result) => (
                <button
                  key={`${result.kind}-${result.title}`}
                  type="button"
                  className={styles.result}
                  onClick={() => onResultSelect(result)}
                >
                  <span className={styles.resultKind}>{result.kind}</span>
                  <span className={styles.resultBody}>
                    <span className={styles.resultTitle}>{result.title}</span>
                    <span className={styles.resultExcerpt}>{result.excerpt}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {noResults && (
            <div className={styles.emptyPanel}>
              <p className={styles.emptyText}>
                Não achamos nada com esse termo — mas a gente responde direto pra você.
              </p>
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.emptyCta}
              >
                Perguntar no WhatsApp
              </a>
            </div>
          )}
        </div>

        {!isTyping && (
          <div className={styles.chips}>
            {CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                className={styles.chip}
                onClick={() => onQueryChange(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
