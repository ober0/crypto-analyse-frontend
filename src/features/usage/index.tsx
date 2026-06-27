'use client'

import { Loader } from '@/components/loader'
import { useGetUsageTotal } from '@/entities/ticker-results/api/use-get-usage-total'
import { formatModelLabel } from '@/shared/lib/format-model-label'
import { cn } from '@/shared/utils'
import { Coins } from 'lucide-react'

const MODEL_TONES = [
    'border-blue-500/20 bg-blue-500/5 text-blue-300',
    'border-violet-500/20 bg-violet-500/5 text-violet-300',
    'border-amber-500/20 bg-amber-500/5 text-amber-300',
    'border-emerald-500/20 bg-emerald-500/5 text-emerald-300',
    'border-rose-500/20 bg-rose-500/5 text-rose-300',
    'border-cyan-500/20 bg-cyan-500/5 text-cyan-300'
] as const

const BAR_TONES = [
    'bg-blue-400',
    'bg-violet-400',
    'bg-amber-400',
    'bg-emerald-400',
    'bg-rose-400',
    'bg-cyan-400'
] as const

const formatTokens = (value: number) => value.toLocaleString('ru-RU')

export const UsageModule = () => {
    const { data, isLoading } = useGetUsageTotal()

    if (isLoading) return <Loader />

    const items = data?.data ?? []
    const grandTotal = items.reduce((sum, item) => sum + item.total, 0)
    const totalPrompt = items.reduce((sum, item) => sum + item.prompt, 0)
    const totalResponse = items.reduce((sum, item) => sum + item.response, 0)

    if (items.length === 0) {
        return (
            <div className="border-primary/50 bg-background/50 flex items-center justify-center rounded-lg border p-8 backdrop-blur">
                <p className="text-muted-foreground text-lg">Нет данных о тратах токенов</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="border-primary/50 bg-background/50 grid grid-cols-1 gap-3 rounded-lg border p-4 backdrop-blur sm:grid-cols-3">
                <SummaryStat label="Всего токенов" value={formatTokens(grandTotal)} highlight />
                <SummaryStat label="Prompt" value={formatTokens(totalPrompt)} />
                <SummaryStat label="Response" value={formatTokens(totalResponse)} />
            </div>

            <div className="border-primary/50 bg-background/50 rounded-lg border p-4 backdrop-blur">
                <h3 className="text-muted-foreground mb-3 text-sm font-medium">Распределение по моделям</h3>
                <div className="flex h-3 overflow-hidden rounded-full bg-gray-800/60">
                    {items.map((item, index) => {
                        const share = grandTotal > 0 ? (item.total / grandTotal) * 100 : 0

                        if (share <= 0) return null

                        return (
                            <div
                                key={item.model}
                                className={cn('h-full transition-all', BAR_TONES[index % BAR_TONES.length])}
                                style={{ width: `${share}%` }}
                                title={`${formatModelLabel(item.model)} — ${share.toFixed(1)}%`}
                            />
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item, index) => {
                    const share = grandTotal > 0 ? (item.total / grandTotal) * 100 : 0

                    return (
                        <div
                            key={item.model}
                            className={cn(
                                'border-primary/50 bg-background/50 flex flex-col gap-3 rounded-lg border p-4 backdrop-blur',
                                MODEL_TONES[index % MODEL_TONES.length]
                            )}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-lg font-semibold text-white">{formatModelLabel(item.model)}</p>
                                    <p className="text-muted-foreground text-xs">{item.model}</p>
                                </div>
                                <Coins className="size-4 shrink-0 text-amber-400/80" />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <UsageStat label="Prompt" value={formatTokens(item.prompt)} />
                                <UsageStat label="Response" value={formatTokens(item.response)} />
                                <UsageStat label="Всего" value={formatTokens(item.total)} highlight />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Доля от общих трат</span>
                                    <span className="font-medium tabular-nums">{share.toFixed(1)}%</span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-gray-800/60">
                                    <div
                                        className={cn('h-full rounded-full', BAR_TONES[index % BAR_TONES.length])}
                                        style={{ width: `${share}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const SummaryStat = ({
    label,
    value,
    highlight
}: {
    label: string
    value: string
    highlight?: boolean
}) => (
    <div
        className={cn(
            'flex flex-col gap-1 rounded-lg border px-4 py-3',
            highlight ? 'border-amber-500/30 bg-amber-500/5' : 'border-gray-700/50 bg-gray-900/20'
        )}
    >
        <span className="text-muted-foreground text-xs uppercase tracking-wide">{label}</span>
        <span className={cn('text-2xl font-bold tabular-nums', highlight && 'text-amber-300')}>{value}</span>
    </div>
)

const UsageStat = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
    <div className="flex flex-col gap-0.5 rounded-md border border-gray-700/40 bg-gray-900/30 px-2.5 py-2">
        <span className="text-muted-foreground text-[10px] uppercase tracking-wide">{label}</span>
        <span className={cn('text-sm font-semibold tabular-nums text-white', highlight && 'text-amber-300')}>
            {value}
        </span>
    </div>
)
