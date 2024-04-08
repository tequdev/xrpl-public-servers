import type { Metadata } from 'next'
import './globals.css'
import { Provider } from './Provider'
import Header from '@/components/Header'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'XRP Ledger Public Servers',
  description: 'A list of public XRP Ledger servers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Provider>
        <body className='dark text-foreground bg-background'>
          <Header />
          {children}
          <Analytics />
        </body>
      </Provider>
    </html>
  )
}
