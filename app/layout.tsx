import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DDoS Attack Simulator',
  description: 'Interactive platform to learn about DDoS attacks and mitigation strategies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}