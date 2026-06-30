'use client'

import { Button } from '@/components/ui/button'
import { Trade } from '@/entities/ai-processing/model/ai-bot'
import { DATE_TIME_DEFAULT_FORMAT } from '@/shared/config'
import { cn } from '@/shared/utils'
import dayjs from 'dayjs'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { formatConfidence, formatPnl, formatPnlPercent, formatPrice, formatQuantity, formatUsd, isPositive, toNumber } from '../lib/format'
import { calcTradeMetrics } from '../lib/trade-metrics'
import {
    TRADE_ACTION_LABELS,
    TRADE_STATUS_LABELS,
    TRADE_STATUS_TONES
} from '../lib/labels'
import { TradeDirectionBadge } from './trade-direction-badge'

interface TradeDetailPanelProps {
    trade: Trade
    onBack?: () => void
    showBack?: boolean
}

export const TradeDetailPanel = ({ trade, onBack, showBack }: TradeDetailPanelProps) => {
    const metrics = calcTradeMetrics(trade)
    const pnl = formatPnl(metrics?.pnl ?? trade.pnl)
    const pnlPercent = formatPnlPercent(metrics?.pnlPercent)
    const entryPrice = formatPrice(trade.averageEntryPrice)
    const currentPrice = formatPrice(trade.currentPrice)
    const size = formatQuantity(trade.currentSize)
    const stopLoss = formatPrice(trade.stopLoss)
    const takeProfit = formatPrice(trade.takeProfit)
    const confidence = formatConfidence(trade.confidence)
    const invested = formatUsd(metrics?.invested)
    const currentValue = formatUsd(metrics?.currentValue)
    const takeProfitValue = formatUsd(metrics?.takeProfitValue)

    const sortedActions = [...trade.actions].sort(
        (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    )

    return (
        <div className="flex h-full min-h-0 flex-col gap-4">
            <div className="flex items-start gap-2">
                {showBack && onBack && (
                    <Button variant="ghost" size="sm" className="mt-0.5 shrink-0 gap-1.5 px-2" onClick={onBack}>
                        <ArrowLeft className="size-3.5" />
                        Назад
                    </Button>
                )}
                <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">#{trade.id}</span>
                        <TradeDirectionBadge direction={trade.direction} />
                        <span
                            className={cn(
                                'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                                TRADE_STATUS_TONES[trade.status]
                            )}
                        >
                            {TRADE_STATUS_LABELS[trade.status]}
                        </span>
                        {pnl && (
                            <span
                                className={cn(
                                    'text-sm font-semibold tabular-nums',
                                    isPositive(metrics?.pnl ?? trade.pnl) ? 'text-green-400' : 'text-red-400'
                                )}
                            >
                                PNL {pnl}
                                {pnlPercent && ` (${pnlPercent})`}
                            </span>
                        )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                        {trade.openedAt && `Открыта: ${dayjs(trade.openedAt).format(DATE_TIME_DEFAULT_FORMAT)}`}
                        {trade.closedAt && ` · Закрыта: ${dayjs(trade.closedAt).format(DATE_TIME_DEFAULT_FORMAT)}`}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {entryPrice && <Metric label="Цена входа" value={`$${entryPrice}`} />}
                {currentPrice && <Metric label="Текущая цена" value={`$${currentPrice}`} />}
                {size && <Metric label="Кол-во" value={size} />}
                {invested && <Metric label="Сумма входа" value={invested} hint={`$${entryPrice} × ${size}`} />}
                {currentValue && (
                    <Metric
                        label="Текущая стоимость"
                        value={currentValue}
                        hint={`$${currentPrice} × ${size}`}
                    />
                )}
                {takeProfitValue && (
                    <Metric
                        label="Сумма при TP"
                        value={takeProfitValue}
                        hint={`$${takeProfit} × ${size}`}
                    />
                )}
                {pnl && (
                    <Metric
                        label="PNL"
                        value={pnlPercent ? `${pnl} (${pnlPercent})` : pnl}
                        className={isPositive(metrics?.pnl ?? trade.pnl) ? 'text-green-400' : 'text-red-400'}
                    />
                )}
                {stopLoss && <Metric label="Stop Loss" value={`$${stopLoss}`} />}
                {takeProfit && <Metric label="Take Profit" value={`$${takeProfit}`} />}
                {confidence && <Metric label="Уверенность" value={confidence} />}
                <Metric label="Таймфрейм" value={trade.mainTimeframe} />
                {trade.closeReason && <Metric label="Причина закрытия" value={trade.closeReason} />}
            </div>

            {(trade.openDescription || trade.closeDescription) && (
                <div className="flex flex-col gap-2">
                    {trade.openDescription && (
                        <DescriptionBlock title="Описание открытия" text={trade.openDescription} />
                    )}
                    {trade.closeDescription && (
                        <DescriptionBlock title="Описание закрытия" text={trade.closeDescription} />
                    )}
                </div>
            )}

            <section className="flex min-h-0 flex-1 flex-col gap-2">
                <h4 className="text-sm font-semibold">Действия ({sortedActions.length})</h4>
                {sortedActions.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Действий пока нет</p>
                ) : (
                    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
                        {sortedActions.map((action) => {
                            const price = formatPrice(action.price)
                            const quantity = formatQuantity(action.quantity)
                            const priceNum = toNumber(action.price)
                            const quantityNum = toNumber(action.quantity)
                            const amount = formatUsd(
                                priceNum != null && quantityNum != null ? priceNum * quantityNum : null
                            )
                            const sl = formatPrice(action.stopLoss)
                            const oldSl = formatPrice(action.oldStopLoss)
                            const tp = formatPrice(action.takeProfit)
                            const oldTp = formatPrice(action.oldTakeProfit)

                            return (
                                <div
                                    key={action.id}
                                    className="rounded-lg border border-white/10 bg-gray-900/30 px-3 py-2.5 text-xs"
                                >
                                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                                        <span className="font-medium">
                                            {TRADE_ACTION_LABELS[action.type] ?? action.type}
                                        </span>
                                        <span className="text-muted-foreground tabular-nums">
                                            {dayjs(action.createdAt).format(DATE_TIME_DEFAULT_FORMAT)}
                                        </span>
                                    </div>
                                    <div className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5">
                                        {price && <span>Цена: ${price}</span>}
                                        {quantity && <span>Кол-во: {quantity}</span>}
                                        {amount && <span>Сумма: {amount}</span>}
                                        {oldSl && sl && <span>SL: ${oldSl} → ${sl}</span>}
                                        {!oldSl && sl && <span>SL: ${sl}</span>}
                                        {oldTp && tp && <span>TP: ${oldTp} → ${tp}</span>}
                                        {!oldTp && tp && <span>TP: ${tp}</span>}
                                    </div>
                                    {action.comment && <CollapsibleComment text={action.comment} />}
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>
        </div>
    )
}

const Metric = ({
    label,
    value,
    hint,
    className
}: {
    label: string
    value: string
    hint?: string
    className?: string
}) => (
    <div className="rounded-lg border border-white/5 bg-black/20 px-2.5 py-2">
        <p className="text-muted-foreground text-[10px] uppercase">{label}</p>
        <p className={cn('text-sm font-medium tabular-nums', className)}>{value}</p>
        {hint && <p className="text-muted-foreground mt-0.5 text-[10px] tabular-nums">{hint}</p>}
    </div>
)

const DescriptionBlock = ({ title, text }: { title: string; text: string }) => (
    <CollapsibleComment text={text} title={title} />
)

const CollapsibleComment = ({ text, title = 'Описание' }: { text: string; title?: string }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="mt-1.5">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
            >
                <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} />
                {open ? `Скрыть ${title.toLowerCase()}` : `Показать ${title.toLowerCase()}`}
            </button>
            {open && <p className="mt-1.5 whitespace-pre-wrap text-xs">{text}</p>}
        </div>
    )
}
