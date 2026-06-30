import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/shared/styles/index.css'
import { QueryProvider } from '@/shared/providers/query-client'
import ResponsiveTargetCursor from '@/components/responsive-target-cursor'
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
            <body className={`${font_flobal.variable} min-w-0 antialiased`}>
                <QueryProvider>{children}</QueryProvider>
                <ResponsiveTargetCursor />
                <Toaster />
                <p className="text-muted-foreground my-4 w-full px-4 text-center text-xs italic sm:text-sm">
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
