'use client'

import { PageHeader } from '@/components/page-layout'
import { SummaryModule } from '@/features/summary'

export default function SummaryPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Отчёты" description="Сводная статистика по сделкам и прогнозам" />
            <SummaryModule />
        </div>
    )
}
