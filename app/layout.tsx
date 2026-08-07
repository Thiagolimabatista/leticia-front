import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Central de Ajuda · Lila Brand',
  description:
    'Tire suas dúvidas sobre prazo de entrega, trocas, tamanhos, frete e pagamento — ou deixe uma mensagem para a nossa equipe.',
}

export const viewport: Viewport = {
  themeColor: '#f0e9e3',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body>{children}</body>
    </html>
  )
}
