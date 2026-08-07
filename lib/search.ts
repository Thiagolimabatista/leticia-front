import { FAQ, LINKS } from '@/lib/faq'

export type SearchTarget =
  | { type: 'faq'; index: number }
  | { type: 'url'; url: string }
  | { type: 'whatsapp' }

export interface SearchResult {
  kind: 'Dúvida' | 'Atalho'
  title: string
  excerpt: string
  target: SearchTarget
}

/** Lowercases and strips diacritics so "devolucao" matches "devolução". */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function score(haystack: string, terms: string[]): number {
  const hay = normalize(haystack)
  return terms.reduce((total, term) => total + (hay.includes(term) ? 1 : 0), 0)
}

/** Ranked FAQ answers plus matching shortcuts for the hero search box. */
export function searchHelpCenter(query: string): SearchResult[] {
  const terms = normalize(query)
    .split(/\s+/)
    .filter((term) => term.length > 1)

  if (!terms.length) return []

  const faqResults: SearchResult[] = FAQ.map((entry, index) => ({
    index,
    entry,
    score: score(`${entry.q} ${entry.a} ${entry.tags}`, terms),
  }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((match) => ({
      kind: 'Dúvida',
      title: match.entry.q,
      excerpt: `${match.entry.a.slice(0, 92)}…`,
      target: { type: 'faq', index: match.index },
    }))

  const linkResults: SearchResult[] = LINKS.filter(
    (link) => score(`${link.title} ${link.tags}`, terms) > 0
  ).map((link) => ({
    kind: 'Atalho',
    title: link.title,
    excerpt: link.excerpt,
    target: link.url === 'wa' ? { type: 'whatsapp' } : { type: 'url', url: link.url },
  }))

  return faqResults.concat(linkResults)
}
