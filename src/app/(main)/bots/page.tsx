'use client'

import { PageHeader } from '@/components/page-layout'
import { AiBotsModule } from '@/features/ai-bots'

export default function BotsPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Торговые боты"
                description="AI-боты для автоматической торговли по тикерам"
            />
            <AiBotsModule />
        </div>
    )
}
