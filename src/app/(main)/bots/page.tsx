'use client'

import { PageHeader } from '@/components/page-layout'
import { Loader } from '@/components/loader'
import { AiBotsModule } from '@/features/ai-bots'
import { useRequireAuth } from '@/entities/auth/hooks/use-require-auth'

export default function BotsPage() {
    const { canRender } = useRequireAuth()

    if (!canRender) return <Loader />

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
