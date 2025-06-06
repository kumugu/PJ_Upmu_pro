import { ThemeProvider } from 'next-themes'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ServiceWorker from '../components/ServiceWorker'

const geistSans = Geist({ 
  variable: "--font-geist-sans",
  subsets: ["latin"] 
})

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono",
  subsets: ["latin"] 
})

export const metadata: Metadata = {
  title: "Upmu",
  description: "퇴근하자자",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192x192.png"
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#111827" />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <ServiceWorker />
        </ThemeProvider>
      </body>
    </html>
  )
}
