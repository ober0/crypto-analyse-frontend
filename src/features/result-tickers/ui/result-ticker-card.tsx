'use client'

import { ResultTicker, TickerDirection } from '@/entities/ticker-results/model/ticker'
import { DATE_TIME_DEFAULT_FORMAT } from '@/shared/config'
import { cn } from '@/shared/utils'
import dayjs from 'dayjs'
import type { ReactNode } from 'react'
import { formatLeverage, formatPercent, formatSignedUsd, formatUsd, isPresent } from '../lib/format'
import { getDirectionIcon, getDirectionLabel, getTimeframeLabel, MODEL_LABELS } from '../lib/labels'
import { TickerUsageDialog } from './ticker-usage-dialog'

interface ResultTickerCardProps {
    ticker: ResultTicker
}

export const ResultTickerCard = ({ ticker }: ResultTickerCardProps) => {
    const openPrice = formatUsd(ticker.currentPrice)
    const predictedPrice = formatUsd(ticker.predictedPrice)
    const closePrice = formatUsd(ticker.realPrice)
    const difference = formatSignedUsd(ticker.difference)
    const unrealizedDifference = formatSignedUsd(ticker.unrealizedDifference)
    const pnl = formatPercent(ticker.pnl)
    const unrealizedPnl = formatPercent(ticker.unrealizedPnl)
    const stopLoss = formatUsd(ticker.stopLoss)
    const takeProfit = formatUsd(ticker.takeProfit)
    const leverage = formatLeverage(ticker.leverage)

    const rowTone =
        isPresent(ticker.difference) && ticker.difference > 0
            ? 'border-green-500/20 bg-green-500/5'
            : isPresent(ticker.difference) && ticker.difference < 0
              ? 'border-red-500/20 bg-red-500/5'
              : 'border-gray-700/50 bg-gray-900/20'

    return (
        <div className={cn('flex flex-col gap-3 rounded-xl border p-3', rowTone)}>
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-base font-semibold text-white">{ticker.ticker.name}</span>
                    <Badge>{getTimeframeLabel(ticker.timeframe)}</Badge>
                    <Badge muted>{MODEL_LABELS[ticker.model] ?? ticker.model}</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                        className={cn(
                            'inline-flex items-center gap-1 font-medium',
                            ticker.direction === TickerDirection.LONG
                                ? 'text-green-400'
                                : ticker.direction === TickerDirection.SHORT
                                  ? 'text-red-400'
                                  : 'text-gray-400'
                        )}
                    >
                        {getDirectionIcon(ticker.direction)} {getDirectionLabel(ticker.direction)}
                    </span>
                    <span className="text-muted-foreground">{dayjs(ticker.createdAt).format(DATE_TIME_DEFAULT_FORMAT)}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className={cn('text-xs font-medium', ticker.isClosed ? 'text-yellow-400' : 'text-green-400')}>
                        {ticker.isClosed ? 'Завершён' : 'Активен'}
                    </span>
                    {!ticker.isPredictAchieved && (
                        <span className="text-muted-foreground text-xs">прогноз не достигнут</span>
                    )}
                    {ticker.usage && <TickerUsageDialog usage={ticker.usage} tickerName={ticker.ticker.name} />}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
                {openPrice && <Metric label="Open" value={openPrice} />}
                {predictedPrice && <Metric label="Pred" value={predictedPrice} className="text-blue-300" />}
                {closePrice && <Metric label="Close" value={closePrice} className="text-purple-300" />}
                {difference && (
                    <Metric
                        label="Δ"
                        value={difference}
                        className={ticker.difference! > 0 ? 'text-green-400' : 'text-red-400'}
                    />
                )}
                {unrealizedDifference && <Metric label="Δ нереал." value={unrealizedDifference} muted />}
                {pnl && (
                    <Metric label="PNL" value={pnl} className={ticker.pnl! > 0 ? 'text-green-400' : 'text-red-400'} />
                )}
                {unrealizedPnl && <Metric label="PNL нереал." value={unrealizedPnl} muted />}
                {stopLoss && <Metric label="SL" value={stopLoss} className="text-red-400" />}
                {takeProfit && <Metric label="TP" value={takeProfit} className="text-green-400" />}
                {leverage && <Metric label="Плечо" value={leverage} />}
            </div>
        </div>
    )
}

const Badge = ({ children, muted }: { children: ReactNode; muted?: boolean }) => (
    <span
        className={cn(
            'rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide',
            muted
                ? 'border-gray-500/30 bg-gray-500/10 text-gray-400'
                : 'border-primary/30 bg-primary/10 text-primary'
        )}
    >
        {children}
    </span>
)

const Metric = ({
    label,
    value,
    className,
    muted
}: {
    label: string
    value: string
    className?: string
    muted?: boolean
}) => (
    <div className="rounded-lg border border-white/5 bg-black/20 px-2.5 py-2">
        <p className="text-muted-foreground text-[10px] uppercase">{label}</p>
        <p className={cn('font-medium tabular-nums', muted ? 'text-muted-foreground' : className)}>{value}</p>
    </div>
)
