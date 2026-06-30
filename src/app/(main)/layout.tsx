import Aurora from '@/components/Aurora'
import { Header } from '@/widgets/header'
import { ReactNode } from 'react'

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="-z-100 absolute left-0 top-0 h-[200px] w-full overflow-hidden sm:h-[300px]">
                <Aurora colorStops={['#668cff', '#b19eef', '#6755af']} blend={0.5} amplitude={1.0} speed={0.5} />
            </div>
            <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-5 sm:py-4 lg:px-8">
                <Header />
                <main className="my-3 min-w-0 sm:my-4">{children}</main>
            </div>
        </>
    )
}
