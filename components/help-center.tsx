'use client'

import { type KeyboardEvent, type ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { FaqAccordion } from '@/components/faq-accordion'
import { HeroSearch } from '@/components/hero-search'
import { type SearchResult, searchHelpCenter } from '@/lib/search'
import { WHATSAPP_GREETING } from '@/lib/site-config'
import { buildWhatsAppLink } from '@/lib/whatsapp'

interface HelpCenterProps {
  /** Rendered between the hero search and the FAQ, matching the design order. */
  children: ReactNode
}

export function HelpCenter({ children }: HelpCenterProps) {
  const faqRef = useRef<HTMLElement>(null)

  const [query, setQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const results = useMemo(() => searchHelpCenter(query), [query])
  const isTyping = query.trim().length > 1
  const whatsAppLink = useMemo(() => buildWhatsAppLink(WHATSAPP_GREETING), [])

  const openFaq = useCallback((index: number) => {
    setOpenIndex(index)
    setQuery('')
    /** Deferred so the answer is already mounted when the smooth scroll starts. */
    window.setTimeout(() => {
      faqRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }, [])

  const selectResult = useCallback(
    (result: SearchResult) => {
      if (result.target.type === 'faq') {
        openFaq(result.target.index)
        return
      }

      const url =
        result.target.type === 'whatsapp'
          ? buildWhatsAppLink('Olá! Vim pela Central de Ajuda e queria falar com alguém.')
          : result.target.url

      window.open(url, '_blank', 'noopener')
    },
    [openFaq]
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && results.length) {
        selectResult(results[0])
      }
      if (event.key === 'Escape') {
        setQuery('')
      }
    },
    [results, selectResult]
  )

  const toggleFaq = useCallback((index: number) => {
    setOpenIndex((current) => (current === index ? null : index))
  }, [])

  return (
    <>
      <HeroSearch
        query={query}
        results={results}
        isTyping={isTyping}
        whatsAppLink={whatsAppLink}
        onQueryChange={setQuery}
        onKeyDown={handleKeyDown}
        onResultSelect={selectResult}
      />
      {children}
      <FaqAccordion openIndex={openIndex} onToggle={toggleFaq} sectionRef={faqRef} />
    </>
  )
}
