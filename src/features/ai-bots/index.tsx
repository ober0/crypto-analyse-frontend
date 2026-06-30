/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client'

import { Loader } from '@/components/loader'
import { GlassPanel } from '@/components/page-layout'
import { Pagination } from '@/components/pagination'
import { useSearchAiBots } from '@/entities/ai-processing/api/use-ai-bots'
import { ProcessingInterval, ProcessingStatus } from '@/entities/ai-processing/model/ai-bot'
import { useIsAuth } from '@/entities/auth/hooks/use-is-auth'
import { useAvailableTickers } from '@/entities/ticker-results/api/use-get-tickers'
import { TickerModels } from '@/entities/ticker-results/model/ticker'
import { PLACEHOLDER_QUERY, SortOptions } from '@/shared/types'
import { useCallback, useState } from 'react'
import { AiBotCard } from './ui/ai-bot-card'
import { AiBotsFilters } from './ui/ai-bots-filters'
import { CreateAiBotDialog } from './ui/create-ai-bot-dialog'

export const AiBotsModule = () => {
    const { isAuth } = useIsAuth()
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(10)

    const [open, setOpen] = useState(false)
    const [valueTicker, setValueTicker] = useState('')
    const [model, setModel] = useState<TickerModels | undefined>(undefined)
    const [status, setStatus] = useState<ProcessingStatus | undefined>(undefined)
    const [interval, setInterval] = useState<ProcessingInterval | undefined>(undefined)
    const [sortStatus, setSortStatus] = useState<SortOptions | undefined>(undefined)

    const { data, isLoading, isPending } = useSearchAiBots({
        ...PLACEHOLDER_QUERY,
        pagination: { page, count },
        filters: {
            tickersIds: valueTicker ? [Number(valueTicker)] : undefined,
            model,
            status,
            interval
        },
        sorts: {
            status: sortStatus || undefined
        }
    })

    const { data: tickers } = useAvailableTickers()

    const handleReset = useCallback(() => {
        setValueTicker('')
        setModel(undefined)
        setStatus(undefined)
        setInterval(undefined)
        setSortStatus(undefined)
        setPage(1)
    }, [])

    if (isLoading) return <Loader />

    const items = data?.data.data ?? []
    const total = data?.data.count ?? 0

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-muted-foreground text-sm">
                    Всего ботов: <span className="text-foreground font-medium">{total}</span>
                </p>
                {isAuth && <CreateAiBotDialog />}
            </div>

            <AiBotsFilters
                tickers={tickers?.data}
                valueTicker={valueTicker}
                setValueTicker={setValueTicker}
                open={open}
                setOpen={setOpen}
                model={model}
                setModel={setModel}
                status={status}
                setStatus={setStatus}
                interval={interval}
                setInterval={setInterval}
                sortStatus={sortStatus}
                setSortStatus={setSortStatus}
                onReset={handleReset}
            />

            {items.length === 0 ? (
                <GlassPanel className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                    <p className="text-muted-foreground">Торговые боты не найдены</p>
                    {isAuth && <CreateAiBotDialog />}
                </GlassPanel>
            ) : (
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {items.map((bot) => (
                        <AiBotCard key={bot.id} bot={bot} />
                    ))}
                </div>
            )}

            {total > 0 && (
                <div className="flex flex-row items-center gap-3">
                    <Pagination
                        totalItems={total}
                        page={page}
                        count={count}
                        handlePageChange={setPage}
                        handleItemsPerPageChange={(value) => {
                            setPage(1)
                            setCount(Number(value))
                        }}
                        isLoading={isPending}
                    />
                </div>
            )}
        </div>
    )
}
