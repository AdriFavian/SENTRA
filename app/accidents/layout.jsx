
export const metadata = {
    title: 'Accidents - SENTRA',
    description: 'Stay Informed with Real-Time Accident Data on SENTRA - Instant Alerts for Your Safety.',
}

export default function RootLayout({ children }) {
    return (
        <main className='min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 p-6 lg:p-8'>
            <div className='max-w-[1600px] mx-auto'>
                {children}
            </div>
        </main>
    )
}
