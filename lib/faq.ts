import { SITE_URL } from '@/lib/site-config'

export interface FaqEntry {
  q: string
  a: string
  tags: string
}

export const FAQ: readonly FaqEntry[] = [
  {
    q: 'Qual é o prazo de entrega?',
    a: 'Os pedidos são despachados em até 2 dias úteis. Depois disso, o prazo varia por região: 3 a 6 dias úteis para o Sudeste e 5 a 12 dias úteis para as demais regiões. O código de rastreio chega por e-mail e WhatsApp assim que o pedido é postado.',
    tags: 'prazo entrega envio demora chegar dias correios rastreio despacho',
  },
  {
    q: 'Como acompanho o meu pedido?',
    a: 'Enviamos o código de rastreio assim que o pedido sai do estoque. Se não encontrar o e-mail, nos chame no WhatsApp com o número do pedido ou o CPF do titular da compra que consultamos para você.',
    tags: 'rastrear rastreio acompanhar pedido codigo status onde esta',
  },
  {
    q: 'Como faço uma troca ou devolução?',
    a: 'Você tem 7 dias corridos após o recebimento para desistir da compra e 30 dias para troca por tamanho ou defeito. A peça precisa estar sem uso e com a etiqueta. Fale com a gente no WhatsApp que enviamos o código de postagem.',
    tags: 'troca trocar devolucao devolver arrependimento reembolso estorno etiqueta',
  },
  {
    q: 'Fiquei na dúvida no tamanho. Como escolher?',
    a: 'Cada produto traz a tabela de medidas na própria página, e a loja tem um Guia de Medidas completo. Se ficar entre dois números, nos mande sua altura, medidas e a peça desejada no WhatsApp que indicamos o tamanho ideal.',
    tags: 'tamanho medidas guia numeracao p m g 36 38 40 caimento veste',
  },
  {
    q: 'Quais são as formas de pagamento?',
    a: 'Aceitamos Pix com 5% de desconto, cartão de crédito em até 6x sem juros e boleto bancário. A primeira compra tem 10% OFF com o cupom BEMVINDA.',
    tags: 'pagamento pix cartao credito parcelar parcelamento boleto juros cupom bemvinda desconto',
  },
  {
    q: 'Quando o frete é grátis?',
    a: 'O frete é grátis para compras acima de R$499 para todo o Brasil. Abaixo desse valor, o cálculo aparece no carrinho de acordo com o seu CEP.',
    tags: 'frete gratis entrega valor cep envio 499 correios',
  },
  {
    q: 'Meu pedido chegou com problema. E agora?',
    a: 'Sentimos muito. Mande uma mensagem no WhatsApp com o número do pedido e fotos da peça em até 7 dias do recebimento. Resolvemos com troca ou reembolso integral.',
    tags: 'defeito problema danificado errado faltando avaria reclamacao',
  },
  {
    q: 'Vocês têm loja física?',
    a: 'Nosso atendimento é 100% online. Toda a curadoria, provas e indicações acontecem pelo WhatsApp com a nossa equipe. Estamos na Avenida Cesário Alvim, 3550.',
    tags: 'loja fisica endereco cesario alvim retirada showroom local',
  },
  {
    q: 'Posso cancelar ou alterar um pedido já feito?',
    a: 'Se o pedido ainda não tiver sido despachado, conseguimos alterar tamanho, endereço ou cancelar. Fale com a gente no WhatsApp o quanto antes com o número do pedido.',
    tags: 'cancelar alterar mudar endereco pedido corrigir',
  },
  {
    q: 'Como funciona a lista de espera de peças esgotadas?',
    a: 'Peças com envio programado mostram a data na página do produto. Se estiver esgotada, nos avise no WhatsApp qual peça e tamanho você quer que te chamamos assim que voltar.',
    tags: 'esgotado estoque reposicao lista espera aviso lancamento',
  },
]

export interface ShortcutLink {
  title: string
  excerpt: string
  /** Absolute URL, or the literal `wa` to build a WhatsApp deep link at runtime. */
  url: string
  tags: string
}

export const LINKS: readonly ShortcutLink[] = [
  {
    title: 'Ir para a loja Lila Brand',
    excerpt: 'Ver todas as coleções, lançamentos e SALE',
    url: SITE_URL,
    tags: 'loja site comprar produtos catalogo lancamentos vestidos jeans sale novidades',
  },
  {
    title: 'Falar no WhatsApp agora',
    excerpt: 'Atendimento humano, seg. a sex., 9h às 18h',
    url: 'wa',
    tags: 'whatsapp contato atendente falar humano telefone ajuda urgente',
  },
]

export const CHIPS: readonly string[] = [
  'Rastrear pedido',
  'Trocas e devolução',
  'Tamanho e medidas',
  'Frete grátis',
  'Pagamento e Pix',
]

export const SUBJECTS: readonly string[] = [
  'Dúvida sobre pedido',
  'Troca ou devolução',
  'Tamanhos e medidas',
  'Frete e prazo',
  'Pagamento',
  'Outro assunto',
]
