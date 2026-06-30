/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client'

import { Button } from '@/components/ui/button'
import { GlassPanel } from '@/components/page-layout'
import {
    useDeleteAiBot,
    useDisableAiBot,
    useEnableAiBot
} from '@/entities/ai-processing/api/use-ai-bots'
import { AiBotListItem } from '@/entities/ai-processing/model/ai-bot'
import { DATE_TIME_DEFAULT_FORMAT } from '@/shared/config'
import { cn } from '@/shared/utils'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { Eye, Pause, Play, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import {
    canDelete,
    canDisable,
    canEnable,
    formatBotModel,
    INTERVAL_LABELS,
    STATUS_LABELS,
    STATUS_TONES
} from '../lib/labels'
import { formatPnl, isPositive } from '../lib/format'
import { AiBotDetailDialog } from './ai-bot-detail-dialog'

interface AiBotCardProps {
    bot: AiBotListItem
}

export const AiBotCard = ({ bot }: AiBotCardProps) => {
    const { mutate: enable, isPending: enabling } = useEnableAiBot()
    const { mutate: disable, isPending: disabling } = useDisableAiBot()
    const { mutate: remove, isPending: deleting } = useDeleteAiBot()

    const handleEnable = () => {
        enable(bot.id, {
            onSuccess: () => {
                toast.success('Бот запущен')
            },
            onError: (e: AxiosError<{ message?: string }>) => {
                toast.error(e.response?.data?.message || 'Ошибка запуска')
            }
        })
    }

    const handleDisable = () => {
        disable(bot.id, {
            onSuccess: () => {
                toast.success('Бот остановлен')
            },
            onError: (e: AxiosError<{ message?: string }>) => {
                toast.error(e.response?.data?.message || 'Ошибка остановки')
            }
        })
    }

    const handleDelete = () => {
        if (!confirm('Удалить торгового бота?')) return

        remove(bot.id, {
            onSuccess: () => {
                toast.success('Бот удалён')
            },
            onError: (e: AxiosError<{ message?: string }>) => {
                toast.error(e.response?.data?.message || 'Ошибка удаления')
            }
        })
    }

    const totalPnl = formatPnl(bot.totalPnl)
    const avgPnl = formatPnl(bot.averagePnl)

    return (
        <GlassPanel className="flex flex-col gap-3 p-3 sm:p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-semibold">{bot.ticker.name}</span>
                        <span className="text-muted-foreground text-xs">{formatBotModel(bot.model)}</span>
                    </div>
                    <span
                        className={cn(
                            'w-fit rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                            STATUS_TONES[bot.status]
                        )}
                    >
                        {STATUS_LABELS[bot.status]}
                    </span>
                </div>
                <AiBotDetailDialog
                    botId={bot.id}
                    trigger={
                        <Button variant="outline" size="sm" className="gap-1.5">
                            <Eye className="size-3.5" />
                            Детали
                        </Button>
                    }
                />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                <Metric label="Интервал" value={INTERVAL_LABELS[bot.interval]} />
                <Metric label="Проверка" value={`${bot.checkIntervalMins} мин`} />
                <Metric label="Сделок" value={String(bot.tradesCount)} />
                {totalPnl && (
                    <Metric
                        label="Общий PNL"
                        value={totalPnl}
                        className={bot.totalPnl != null && isPositive(bot.totalPnl) ? 'text-green-400' : 'text-red-400'}
                    />
                )}
                {avgPnl && (
                    <Metric
                        label="Ср. PNL"
                        value={avgPnl}
                        className={bot.averagePnl != null && isPositive(bot.averagePnl) ? 'text-green-400' : 'text-red-400'}
                    />
                )}
                <Metric label="Веб-поиск" value={bot.withWebSearch ? 'Да' : 'Нет'} />
            </div>

            <div className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                {bot.startAt && <span>Старт: {dayjs(bot.startAt).format(DATE_TIME_DEFAULT_FORMAT)}</span>}
                {bot.endAt && <span>Конец: {dayjs(bot.endAt).format(DATE_TIME_DEFAULT_FORMAT)}</span>}
                {bot.nextCheckAt && <span>След. проверка: {dayjs(bot.nextCheckAt).format(DATE_TIME_DEFAULT_FORMAT)}</span>}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-white/5 pt-3">
                {canEnable(bot.status) && (
                    <Button size="sm" className="gap-1.5" onClick={handleEnable} loading={enabling}>
                        <Play className="size-3.5" />
                        Запустить
                    </Button>
                )}
                {canDisable(bot.status) && (
                    <Button
                        size="sm"
                        variant="secondary"
                        className="gap-1.5"
                        onClick={handleDisable}
                        loading={disabling}
                    >
                        <Pause className="size-3.5" />
                        Остановить
                    </Button>
                )}
                {canDelete(bot.status) && (
                    <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1.5"
                        onClick={handleDelete}
                        loading={deleting}
                    >
                        <Trash2 className="size-3.5" />
                        Удалить
                    </Button>
                )}
            </div>
        </GlassPanel>
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
