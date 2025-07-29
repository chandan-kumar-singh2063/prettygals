import './globals.css'
import { Inter } from 'next/font/google'
import { AppProvider } from '@/context/AppContext'
import { SessionProvider } from '@/components/providers/SessionProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PrettyGals - Premium Beauty Products',
  description: 'Discover premium beauty products for eyes, lips, face, and perfumes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <AppProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </AppProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
