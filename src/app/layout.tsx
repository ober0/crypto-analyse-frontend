import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/shared/styles/index.css'
import { QueryProvider } from '@/shared/providers/query-client'
import TargetCursor from '@/components/TargetCursor'
import { Toaster } from 'react-hot-toast'

const font_flobal = Inter({
    variable: '--font',
    subsets: ['latin', 'cyrillic', 'cyrillic-ext', 'latin-ext']
})

export const metadata: Metadata = {
    title: 'Every day Forecast for crypto',
    description: 'Every day forecast with AI',
    keywords: ['Прогноз валют', 'Forecast', 'crypto forecast', 'stocks forecast']
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ru" className="dark">
            <body className={`${font_flobal.variable} antialiased`}>
                <QueryProvider>{children}</QueryProvider>
                <TargetCursor spinDuration={7} hideDefaultCursor={true} />
                <Toaster />
                <p className="my-4 w-full text-center text-sm italic">
                    created by{' '}
                    <a href="https://github.com/roso1nik" className="cursor-target underline">
                        @roso1nik
                    </a>{' '}
                    &{' '}
                    <a href="https://github.com/ober0" className="cursor-target underline">
                        @ober0
                    </a>
                </p>
            </body>
        </html>
    )
}
