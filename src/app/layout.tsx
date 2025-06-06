import { ThemeProvider } from 'next-themes'
import type { Metadata } from 'next'
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
  themeColor: "#111827",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192x192.png"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <ServiceWorker />
        </ThemeProvider>
      </body>
    </html>
  )
}
