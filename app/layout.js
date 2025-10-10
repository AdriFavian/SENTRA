import Script from 'next/script'
import Sidebar from './components/Sidebar'
import './globals.css'
import { Poppins } from 'next/font/google'
import Popups from './components/Popups'
import { Toaster } from 'react-hot-toast'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata = {
  title: 'SENTRA - Stay Safe, Instant Alert',
  description: 'Stay Safe with SENTRA - Get Instant Alerts for Accidents.',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=geometry`}
      />{' '}
      <body className={`${poppins.className} flex min-h-screen bg-gray-50`}>
        <Toaster />
        <Popups />
        <Sidebar />
        <main className='flex-1 overflow-x-hidden'>{children}</main>
      </body>
    </html>
  )
}
