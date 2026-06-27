'use client'

import { ResultTicker, TickerDirection } from '@/entities/ticker-results/model/ticker'
import { DATE_TIME_DEFAULT_FORMAT } from '@/shared/config'
import { cn } from '@/shared/utils'
import dayjs from 'dayjs'
import type { ReactNode } from 'react'
import { formatLeverage, formatPercent, formatSignedUsd, formatUsd, isPresent } from '../lib/format'
import { getDirectionIcon, getDirectionLabel, getTimeframeLabel, MODEL_LABELS } from '../lib/labels'
import { TickerUsageDialog } from './ticker-usage-dialog'

interface ResultTickerRowProps {
    ticker: ResultTicker
}

export const ResultTickerRow = ({ ticker }: ResultTickerRowProps) => {
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

    const hasPrices = openPrice || predictedPrice || closePrice
    const hasDiff = difference || unrealizedDifference
    const hasPnl = pnl || unrealizedPnl
    const hasRisk = stopLoss || takeProfit || leverage

    const rowTone =
        isPresent(ticker.difference) && ticker.difference > 0
            ? 'from-green-500/5 via-green-500/10 to-green-500/5 hover:from-green-500/10 hover:via-green-500/20 hover:to-green-500/10'
            : isPresent(ticker.difference) && ticker.difference < 0
              ? 'from-red-500/5 via-red-500/10 to-red-500/5 hover:from-red-500/10 hover:via-red-500/20 hover:to-red-500/10'
              : 'from-transparent via-gray-800/5 to-transparent hover:from-gray-800/10 hover:via-gray-800/20 hover:to-gray-800/10'

    return (
        <tr
            className={cn(
                'bg-linear-to-r cursor-target group from-transparent transition-all duration-300',
                rowTone
            )}
        >
            <td className="whitespace-nowrap px-3 py-2.5">
                <div className="flex min-w-[180px] flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-semibold text-white">{ticker.ticker.name}</span>
                        <Badge>{getTimeframeLabel(ticker.timeframe)}</Badge>
                        <Badge muted>{MODEL_LABELS[ticker.model] ?? ticker.model}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={cn(
                                'inline-flex items-center gap-1 text-xs font-medium',
                                ticker.direction === TickerDirection.LONG
                                    ? 'text-green-400'
                                    : ticker.direction === TickerDirection.SHORT
                                      ? 'text-red-400'
                                      : 'text-gray-400'
                            )}
                        >
                            <span className="text-sm leading-none">{getDirectionIcon(ticker.direction)}</span>
                            {getDirectionLabel(ticker.direction)}
                        </span>
                        <span className="text-muted-foreground text-xs">
                            {dayjs(ticker.createdAt).format(DATE_TIME_DEFAULT_FORMAT)}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={cn(
                                'text-xs font-medium',
                                ticker.isClosed ? 'text-yellow-400' : 'text-green-400'
                            )}
                        >
                            {ticker.isClosed ? 'Завершён' : 'Активен'}
                        </span>
                        {!ticker.isPredictAchieved && (
                            <span className="text-muted-foreground text-xs">прогноз не достигнут</span>
                        )}
                        {ticker.usage && <TickerUsageDialog usage={ticker.usage} tickerName={ticker.ticker.name} />}
                    </div>
                </div>
            </td>

            <td className="whitespace-nowrap px-3 py-2.5">
                {hasPrices ? (
                    <div className="flex min-w-[140px] flex-col gap-0.5 text-xs">
                        {openPrice && <PriceLine label="Open" value={openPrice} className="text-white" />}
                        {predictedPrice && (
                            <PriceLine label="Pred" value={predictedPrice} className="text-blue-300" />
                        )}
                        {closePrice && <PriceLine label="Close" value={closePrice} className="text-purple-300" />}
                    </div>
                ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                )}
            </td>

            <td className="whitespace-nowrap px-3 py-2.5">
                {hasDiff ? (
                    <div className="flex min-w-[90px] flex-col gap-0.5 text-xs">
                        {difference && (
                            <span
                                className={cn(
                                    'font-medium tabular-nums',
                                    ticker.difference! > 0 ? 'text-green-400' : 'text-red-400'
                                )}
                            >
                                {difference}
                            </span>
                        )}
                        {unrealizedDifference && (
                            <span className="text-muted-foreground tabular-nums">{unrealizedDifference}</span>
                        )}
                    </div>
                ) : null}
            </td>

            <td className="whitespace-nowrap px-3 py-2.5">
                {hasPnl ? (
                    <div className="flex min-w-[70px] flex-col gap-0.5 text-xs">
                        {pnl && (
                            <span
                                className={cn(
                                    'font-medium tabular-nums',
                                    ticker.pnl! > 0 ? 'text-green-400' : 'text-red-400'
                                )}
                            >
                                {pnl}
                            </span>
                        )}
                        {unrealizedPnl && (
                            <span className="text-muted-foreground tabular-nums">{unrealizedPnl}</span>
                        )}
                    </div>
                ) : null}
            </td>

            <td className="whitespace-nowrap px-3 py-2.5">
                {hasRisk ? (
                    <div className="flex min-w-[100px] flex-col gap-0.5 text-xs">
                        {stopLoss && (
                            <span className="text-red-400 tabular-nums">
                                <span className="text-muted-foreground">SL </span>
                                {stopLoss}
                            </span>
                        )}
                        {takeProfit && (
                            <span className="text-green-400 tabular-nums">
                                <span className="text-muted-foreground">TP </span>
                                {takeProfit}
                            </span>
                        )}
                        {leverage && (
                            <span className="text-white tabular-nums">
                                <span className="text-muted-foreground">× </span>
                                {leverage}
                            </span>
                        )}
                    </div>
                ) : null}
            </td>
        </tr>
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

const PriceLine = ({ label, value, className }: { label: string; value: string; className?: string }) => (
    <div className="flex items-baseline justify-between gap-3">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn('font-medium tabular-nums', className)}>{value}</span>
    </div>
)
