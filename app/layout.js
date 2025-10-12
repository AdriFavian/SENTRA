import Script from 'next/script'
import Sidebar from './components/Sidebar'
import './globals.css'
import { Poppins } from 'next/font/google'
import Popups from './components/Popups'
import { Toaster } from 'react-hot-toast'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata = {
  title: 'SENTRA - Smart Traffic Safety AI',
  description: 'Real-time accident detection and traffic monitoring powered by AI',
  keywords: ['traffic safety', 'accident detection', 'AI monitoring', 'CCTV analytics'],
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={poppins.variable}>
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=geometry`}
          strategy='beforeInteractive'
        />
      </head>
      <body className='flex min-h-screen bg-neutral-50 antialiased'>
        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#171717',
              borderRadius: '12px',
              border: '1px solid #e5e5e5',
              padding: '16px',
              boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        {/* Accident Alert Popups */}
        <Popups />
        
        {/* Sidebar Navigation */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto'>
          {children}
        </main>
      </body>
    </html>
  )
}
