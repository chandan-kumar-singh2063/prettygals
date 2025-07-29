import './globals.css'
import { Inter } from 'next/font/google'
import { AppProvider } from '../context/AppContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Beauty E-commerce',
  description: 'Your one-stop shop for beauty products',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
