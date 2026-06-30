'use client'

import { AiBotDetail } from '@/entities/ai-processing/model/ai-bot'
import { useIsAuth } from '@/entities/auth/hooks/use-is-auth'
import { DATE_TIME_DEFAULT_FORMAT } from '@/shared/config'
import { cn } from '@/shared/utils'
import dayjs from 'dayjs'
import { formatPnl, isPositive, toNumber } from '../lib/format'
import {
    formatBotModel,
    INTERVAL_LABELS,
    STATUS_LABELS,
    STATUS_TONES
} from '../lib/labels'
import { EditAiBotDialog } from './edit-ai-bot-dialog'

interface AiBotInfoTabProps {
    bot: AiBotDetail
}

export const AiBotInfoTab = ({ bot }: AiBotInfoTabProps) => {
    const { isAuth } = useIsAuth()
    const closedPnls = bot.trades
        .map((trade) => toNumber(trade.pnl))
        .filter((value): value is number => value != null)

    const totalPnl = closedPnls.length
        ? closedPnls.reduce((sum, value) => sum + value, 0)
        : null
    const averagePnl = closedPnls.length ? totalPnl! / closedPnls.length : null

    const totalPnlFormatted = formatPnl(totalPnl)
    const averagePnlFormatted = formatPnl(averagePnl)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
                <span
                    className={cn(
                        'rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase',
                        STATUS_TONES[bot.status]
                    )}
                >
                    {STATUS_LABELS[bot.status]}
                </span>
                <span className="text-muted-foreground text-xs">
                    {bot.ticker.name} · {formatBotModel(bot.model)}
                </span>
                {isAuth && <EditAiBotDialog bot={bot} />}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Metric label="Интервал" value={INTERVAL_LABELS[bot.interval]} />
                <Metric label="Проверка" value={`${bot.checkIntervalMins} мин`} />
                <Metric label="Сделок" value={String(bot.trades.length)} />
                {totalPnlFormatted && (
                    <Metric
                        label="Общий PNL"
                        value={totalPnlFormatted}
                        className={totalPnl != null && isPositive(totalPnl) ? 'text-green-400' : 'text-red-400'}
                    />
                )}
                {averagePnlFormatted && (
                    <Metric
                        label="Ср. PNL"
                        value={averagePnlFormatted}
                        className={averagePnl != null && isPositive(averagePnl) ? 'text-green-400' : 'text-red-400'}
                    />
                )}
                <Metric label="Веб-поиск" value={bot.withWebSearch ? 'Да' : 'Нет'} />
            </div>

            <div className="text-muted-foreground flex flex-col gap-1 rounded-lg border border-white/5 bg-black/20 px-3 py-2.5 text-xs">
                {bot.startAt && <span>Старт: {dayjs(bot.startAt).format(DATE_TIME_DEFAULT_FORMAT)}</span>}
                {bot.endAt && <span>Конец: {dayjs(bot.endAt).format(DATE_TIME_DEFAULT_FORMAT)}</span>}
                {bot.lastCheckAt && (
                    <span>Последняя проверка: {dayjs(bot.lastCheckAt).format(DATE_TIME_DEFAULT_FORMAT)}</span>
                )}
                {bot.nextCheckAt && (
                    <span>След. проверка: {dayjs(bot.nextCheckAt).format(DATE_TIME_DEFAULT_FORMAT)}</span>
                )}
                <span>Создан: {dayjs(bot.createdAt).format(DATE_TIME_DEFAULT_FORMAT)}</span>
            </div>

            {bot.customPrompt && (
                <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm">
                    <p className="text-muted-foreground mb-1.5 text-xs uppercase">Промпт</p>
                    <p className="whitespace-pre-wrap">{bot.customPrompt}</p>
                </div>
            )}
        </div>
    )
}

const Metric = ({
    label,
    value,
    className
}: {
    label: string
    value: string
    className?: string
}) => (
    <div className="rounded-lg border border-white/5 bg-black/20 px-2.5 py-2">
        <p className="text-muted-foreground text-[10px] uppercase">{label}</p>
        <p className={cn('text-sm font-medium tabular-nums', className)}>{value}</p>
    </div>
)
