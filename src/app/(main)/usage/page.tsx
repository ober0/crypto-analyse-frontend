'use client'

import { Loader } from '@/components/loader'
import { PageHeader } from '@/components/page-layout'
import { useIsAuth } from '@/entities/auth/hooks/use-is-auth'
import { UsageModule } from '@/features/usage'
import { ROUTES } from '@/shared/router'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function UsagePage() {
    const { push } = useRouter()
    const { isAuth, isLoading } = useIsAuth()

    useEffect(() => {
        if (!isLoading && !isAuth) {
            push(ROUTES.HOME_PAGE)
        }
    }, [isAuth, isLoading, push])

    if (isLoading || !isAuth) return <Loader />

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Траты" description="Расход токенов по прогнозам и AI ботам" />
            <UsageModule />
        </div>
    )
}
