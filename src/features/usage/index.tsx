'use client'

import { Loader } from '@/components/loader'
import { GlassPanel } from '@/components/page-layout'
import { Button } from '@/components/ui/button'
import { useGetAiUsageTotal } from '@/entities/ai-processing/api/use-get-ai-usage-total'
import { useGetUsageTotal } from '@/entities/ticker-results/api/use-get-usage-total'
import { cn } from '@/shared/utils'
import { Bot, LineChart } from 'lucide-react'
import { useState } from 'react'
import { UsageStatsView } from './ui/usage-stats-view'

type UsageTab = 'tickers' | 'ai-bots'

const TABS: { id: UsageTab; label: string; icon: typeof LineChart }[] = [
    { id: 'tickers', label: 'Прогнозы', icon: LineChart },
    { id: 'ai-bots', label: 'AI боты', icon: Bot }
]

export const UsageModule = () => {
    const [tab, setTab] = useState<UsageTab>('tickers')

    return (
        <div className="flex flex-col gap-4">
            <GlassPanel className="flex flex-wrap gap-1 p-1.5 sm:gap-2 sm:p-2">
                {TABS.map(({ id, label, icon: Icon }) => (
                    <Button
                        key={id}
                        variant={tab === id ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setTab(id)}
                        className={cn('min-w-0 flex-1 gap-1.5 rounded-lg sm:flex-none', tab !== id && 'text-muted-foreground')}
                    >
                        <Icon className="size-4" />
                        {label}
                    </Button>
                ))}
            </GlassPanel>

            {tab === 'tickers' ? <TickerUsageTab /> : <AiBotsUsageTab />}
        </div>
    )
}

const TickerUsageTab = () => {
    const { data, isLoading } = useGetUsageTotal()

    if (isLoading) return <Loader />

    return (
        <UsageStatsView
            items={data?.data ?? []}
            emptyMessage="Нет данных о тратах токенов на прогнозы"
        />
    )
}

const AiBotsUsageTab = () => {
    const { data, isLoading } = useGetAiUsageTotal()

    if (isLoading) return <Loader />

    return (
        <UsageStatsView
            items={data?.data ?? []}
            emptyMessage="Нет данных о тратах токенов AI ботов"
            icon={<Bot className="size-4 shrink-0 text-violet-400/80" />}
        />
    )
}
