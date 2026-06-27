'use client'

import { Loader } from '@/components/loader'
import { useAvailableTickers } from '@/entities/ticker-results/api/use-get-tickers'
import { cn } from '@/shared/utils'
import { Activity, TrendingUp } from 'lucide-react'

const CARD_ACCENTS = [
    'from-blue-500/20 via-blue-500/5 to-transparent border-blue-500/20',
    'from-violet-500/20 via-violet-500/5 to-transparent border-violet-500/20',
    'from-emerald-500/20 via-emerald-500/5 to-transparent border-emerald-500/20',
    'from-amber-500/20 via-amber-500/5 to-transparent border-amber-500/20',
    'from-rose-500/20 via-rose-500/5 to-transparent border-rose-500/20',
    'from-cyan-500/20 via-cyan-500/5 to-transparent border-cyan-500/20'
] as const

export const AvailableTickers = () => {
    const { data: tickers, isLoading } = useAvailableTickers()

    if (isLoading) return <Loader />

    if (!tickers?.data.length) {
        return (
            <div className="border-primary/50 bg-background/50 flex items-center justify-center rounded-xl border p-8 backdrop-blur">
                <p className="text-muted-foreground">Нет доступных тикеров</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tickers.data.map((ticker, index) => (
                <div
                    key={ticker.id}
                    className={cn(
                        'group relative overflow-hidden rounded-xl border bg-linear-to-br p-4 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20',
                        CARD_ACCENTS[index % CARD_ACCENTS.length]
                    )}
                >
                    <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/5 blur-2xl transition-opacity group-hover:opacity-100" />

                    <div className="relative flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                            <div className="bg-background/40 flex size-9 items-center justify-center rounded-lg border border-white/10">
                                <TrendingUp className="text-primary size-4" />
                            </div>
                            <span className="text-muted-foreground rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-medium tabular-nums">
                                #{ticker.id}
                            </span>
                        </div>

                        <div>
                            <p className="text-lg font-bold tracking-tight">{ticker.name}</p>
                            <p className="text-muted-foreground mt-0.5 text-xs">Торговая пара</p>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                            <Activity className="size-3.5 text-emerald-400" />
                            <span className="text-muted-foreground text-xs">Прогонов:</span>
                            <span className="ml-auto text-sm font-semibold tabular-nums">{ticker.processCount}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
