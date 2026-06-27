'use client'

import { UsageModule } from '@/features/usage'
import { useIsAuth } from '@/entities/auth/hooks/use-is-auth'
import { Loader } from '@/components/loader'
import { ROUTES } from '@/shared/router'
import { useRouter } from 'next/navigation'

export default function UsagePage() {
    const { push } = useRouter()
    const { isAuth, isLoading } = useIsAuth()

    if (isLoading) return <Loader />

    if (!isAuth) return push(ROUTES.AUTH_PAGE)

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold">Траты на токены</h1>
            <UsageModule />
        </div>
    )
}
