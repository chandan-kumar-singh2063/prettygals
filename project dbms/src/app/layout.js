import './globals.css'
import { Inter } from 'next/font/google'
import { AppProvider } from '../context/AppContext'
import { ToastProvider } from '../context/ToastContext'
import Navbar from '../components/Navbar'
import Footer from '../components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PrettyGals - Premium Beauty & Cosmetics',
  description: 'Enhance your beauty with our premium makeup products. Shop face, eyes, lips, perfume and more.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-pink-50 to-rose-100 min-h-screen`}>
        <ToastProvider>
          <AppProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow pt-16">
                {children}
              </main>
              <Footer />
            </div>
          </AppProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
