import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
            {children}
        </div>
    )
}
