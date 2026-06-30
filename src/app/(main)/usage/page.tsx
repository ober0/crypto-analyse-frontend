'use client'

import { PageHeader } from '@/components/page-layout'
import { UsageModule } from '@/features/usage'
import { useRequireAuth } from '@/entities/auth/hooks/use-require-auth'
import { Loader } from '@/components/loader'

export default function UsagePage() {
    const { canRender } = useRequireAuth()

    if (!canRender) return <Loader />

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Траты" description="Расход токенов по прогнозам и AI ботам" />
            <UsageModule />
        </div>
    )
}
