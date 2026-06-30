'use client'

import { PageHeader } from '@/components/page-layout'
import { Loader } from '@/components/loader'
import { SummaryModule } from '@/features/summary'
import { useRequireAuth } from '@/entities/auth/hooks/use-require-auth'

export default function SummaryPage() {
    const { canRender } = useRequireAuth()

    if (!canRender) return <Loader />

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Отчёты" description="Сводная статистика по сделкам и прогнозам" />
            <SummaryModule />
        </div>
    )
}
