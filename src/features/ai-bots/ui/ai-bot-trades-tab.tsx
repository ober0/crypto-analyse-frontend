'use client'

import { Trade } from '@/entities/ai-processing/model/ai-bot'
import { DATE_TIME_DEFAULT_FORMAT } from '@/shared/config'
import { cn } from '@/shared/utils'
import dayjs from 'dayjs'
import { ChevronRight } from 'lucide-react'
import { formatPnl, formatPnlPercent, formatPrice, formatUsd, isPositive } from '../lib/format'
import { calcTradeMetrics } from '../lib/trade-metrics'
import {
    TRADE_STATUS_LABELS,
    TRADE_STATUS_TONES
} from '../lib/labels'
import { TradeDetailPanel } from './trade-detail-panel'
import { TradeDirectionBadge } from './trade-direction-badge'

interface AiBotTradesTabProps {
    trades: Trade[]
    selectedTradeId: number | null
    onSelectTrade: (tradeId: number | null) => void
}

export const AiBotTradesTab = ({ trades, selectedTradeId, onSelectTrade }: AiBotTradesTabProps) => {
    const selectedTrade = trades.find((trade) => trade.id === selectedTradeId) ?? null
    const sortedTrades = [...trades].sort(
        (a, b) => dayjs(b.openedAt).valueOf() - dayjs(a.openedAt).valueOf()
    )

    if (trades.length === 0) {
        return <p className="text-muted-foreground py-8 text-center text-sm">Сделок пока нет</p>
    }

    return (
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
            <div
                className={cn(
                    'flex min-h-0 flex-col gap-2',
                    selectedTrade && 'hidden lg:flex'
                )}
            >
                <p className="text-muted-foreground text-xs uppercase">Все сделки</p>
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
                    {sortedTrades.map((trade) => (
                        <TradeListItem
                            key={trade.id}
                            trade={trade}
                            selected={trade.id === selectedTradeId}
                            onSelect={() => onSelectTrade(trade.id)}
                        />
                    ))}
                </div>
            </div>

            {selectedTrade ? (
                <div className="flex min-h-0 flex-col rounded-lg border border-white/10 bg-black/10 p-3 sm:p-4">
                    <TradeDetailPanel
                        trade={selectedTrade}
                        showBack
                        onBack={() => onSelectTrade(null)}
                    />
                </div>
            ) : (
                <div className="hidden items-center justify-center rounded-lg border border-dashed border-white/10 bg-black/10 p-6 text-center lg:flex">
                    <p className="text-muted-foreground text-sm">
                        Выберите сделку слева, чтобы посмотреть детали и действия
                    </p>
                </div>
            )}
        </div>
    )
}

const TradeListItem = ({
    trade,
    selected,
    onSelect
}: {
    trade: Trade
    selected: boolean
    onSelect: () => void
}) => {
    const metrics = calcTradeMetrics(trade)
    const pnl = formatPnl(metrics?.pnl ?? trade.pnl)
    const pnlPercent = formatPnlPercent(metrics?.pnlPercent)
    const entryPrice = formatPrice(trade.averageEntryPrice)
    const currentPrice = formatPrice(trade.currentPrice)
    const invested = formatUsd(metrics?.invested)

    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-xs transition-colors',
                selected
                    ? 'border-white/20 bg-white/10'
                    : 'border-white/10 bg-gray-900/30 hover:border-white/15 hover:bg-gray-900/50'
            )}
        >
            <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="font-medium">#{trade.id}</span>
                    <TradeDirectionBadge direction={trade.direction} />
                    <span
                        className={cn(
                            'rounded-full border px-1.5 py-0.5 text-[10px] font-medium',
                            TRADE_STATUS_TONES[trade.status]
                        )}
                    >
                        {TRADE_STATUS_LABELS[trade.status]}
                    </span>
                </div>
                {(entryPrice || currentPrice) && (
                    <p className="text-muted-foreground">
                        ${entryPrice ?? '—'} → ${currentPrice ?? '—'}
                        {invested && ` · вход ${invested}`}
                    </p>
                )}
                {trade.openedAt && (
                    <p className="text-muted-foreground mt-0.5">
                        {dayjs(trade.openedAt).format(DATE_TIME_DEFAULT_FORMAT)}
                    </p>
                )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
                {pnl && (
                    <span
                        className={cn(
                            'font-semibold tabular-nums',
                            isPositive(metrics?.pnl ?? trade.pnl) ? 'text-green-400' : 'text-red-400'
                        )}
                    >
                        {pnl}
                        {pnlPercent && ` (${pnlPercent})`}
                    </span>
                )}
                <ChevronRight className="text-muted-foreground size-4" />
            </div>
        </button>
    )
}
