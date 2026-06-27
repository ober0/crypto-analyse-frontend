import Aurora from '@/components/Aurora'
import { Header } from '@/widgets/header'
import { ReactNode } from 'react'

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="-z-100 absolute left-0 top-0 h-[300px] w-full overflow-hidden">
                <Aurora colorStops={['#668cff', '#b19eef', '#6755af']} blend={0.5} amplitude={1.0} speed={0.5} />
            </div>
            <div className="mx-auto w-3/4 py-4">
                <Header />
                <main className="my-4 px-0 lg:px-4">{children}</main>
            </div>
        </>
    )
}
