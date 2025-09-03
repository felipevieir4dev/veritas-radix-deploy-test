import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Veritas Radix - A Verdade nas Raízes das Palavras',
  description: 'Explore as raízes etimológicas das palavras e descubra as histórias escondidas na linguagem',
  keywords: 'etimologia, palavras, raízes, linguagem, latim, grego, português',
  authors: [{ name: 'Veritas Radix' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}