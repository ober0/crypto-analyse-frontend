/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client'

import { Loader } from '@/components/loader'
import { GlassPanel } from '@/components/page-layout'
import { Pagination } from '@/components/pagination'
import { useResultsTickers } from '@/entities/ticker-results/api/use-get-processed-tickers'
import { useAvailableTickers } from '@/entities/ticker-results/api/use-get-tickers'
import { TickerModels } from '@/entities/ticker-results/model/ticker'
import { PLACEHOLDER_QUERY, SortOptions } from '@/shared/types'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import { ResultTickerRow } from './ui/result-ticker-row'
import { ResultTickerCard } from './ui/result-ticker-card'
import { ResultsFilters } from './ui/results-filters'

export const ResultsTickersList = () => {
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(10)

    const [isClosed, setIsClosed] = useState<string | undefined>(undefined)
    const [open, setOpen] = useState(false)
    const [valueTicker, setValueTicker] = useState('')

    const [openDate, setOpenDate] = useState(false)
    const [dateMin, setDateMin] = useState<Date | undefined>(undefined)
    const [openDateMax, setOpenDateMax] = useState(false)
    const [dateMax, setDateMax] = useState<Date | undefined>(undefined)

    const [openCreatedDateMin, setOpenCreatedDateMin] = useState(false)
    const [createdDateMin, setCreatedDateMin] = useState<Date | undefined>(undefined)
    const [openCreatedDateMax, setOpenCreatedDateMax] = useState(false)
    const [createdDateMax, setCreatedDateMax] = useState<Date | undefined>(undefined)

    const [model, setModel] = useState<TickerModels | undefined>(undefined)

    const [sortCreated, setSortCreated] = useState<SortOptions | undefined>(undefined)
    const [sortPnl, setSortPnl] = useState<SortOptions | undefined>(undefined)
    const [sortUnrealizedPnl, setSortUnrealizedPnl] = useState<SortOptions | undefined>(undefined)
    const [sortIsClosed, setSortIsClosed] = useState<SortOptions | undefined>(undefined)
    const [sortClosedAt, setSortClosedAt] = useState<SortOptions | undefined>(undefined)

    const {
        data: resultsTicker,
        isLoading,
        isPending
    } = useResultsTickers({
        ...PLACEHOLDER_QUERY,
        pagination: { count: count, page: page },
        filters: {
            createdAt: {
                min: createdDateMin ? dayjs(createdDateMin)?.startOf('day')?.toISOString() : undefined,
                max: createdDateMax ? dayjs(createdDateMax)?.endOf('day')?.toISOString() : undefined
            },
            closedAt: {
                min: dateMin ? dayjs(dateMin)?.startOf('day')?.toISOString() : undefined,
                max: dateMax ? dayjs(dateMax)?.endOf('day')?.toISOString() : undefined
            },
            tickersIds: valueTicker ? [Number(valueTicker)] : undefined,
            model: model,
            isClosed: isClosed === undefined ? undefined : Boolean(isClosed)
        },
        sorts: {
            createdAt: sortCreated ? sortCreated : undefined,
            pnl: sortPnl ? sortPnl : undefined,
            unrealizedPnl: sortUnrealizedPnl ? sortUnrealizedPnl : undefined,
            isClosed: sortIsClosed ? sortIsClosed : undefined,
            closedAt: sortClosedAt ? sortClosedAt : undefined
        }
    })

    const { data: tickers } = useAvailableTickers()

    const handleReset = useCallback(() => {
        setValueTicker('')
        setCreatedDateMin(undefined)
        setCreatedDateMax(undefined)
        setDateMin(undefined)
        setDateMax(undefined)
        setModel(undefined)
        setIsClosed(undefined)
        setSortCreated(undefined)
        setSortPnl(undefined)
        setSortUnrealizedPnl(undefined)
        setSortIsClosed(undefined)
        setSortClosedAt(undefined)
        setPage(1)
    }, [])

    if (isLoading) return <Loader />

    return (
        <div className="flex flex-col gap-4">
            <ResultsFilters
                tickers={tickers?.data}
                valueTicker={valueTicker}
                setValueTicker={setValueTicker}
                open={open}
                setOpen={setOpen}
                createdDateMin={createdDateMin}
                setCreatedDateMin={setCreatedDateMin}
                openCreatedDateMin={openCreatedDateMin}
                setOpenCreatedDateMin={setOpenCreatedDateMin}
                createdDateMax={createdDateMax}
                setCreatedDateMax={setCreatedDateMax}
                openCreatedDateMax={openCreatedDateMax}
                setOpenCreatedDateMax={setOpenCreatedDateMax}
                dateMin={dateMin}
                setDateMin={setDateMin}
                openDate={openDate}
                setOpenDate={setOpenDate}
                dateMax={dateMax}
                setDateMax={setDateMax}
                openDateMax={openDateMax}
                setOpenDateMax={setOpenDateMax}
                model={model}
                setModel={setModel}
                isClosed={isClosed}
                setIsClosed={setIsClosed}
                sortCreated={sortCreated}
                setSortCreated={setSortCreated}
                sortPnl={sortPnl}
                setSortPnl={setSortPnl}
                sortUnrealizedPnl={sortUnrealizedPnl}
                setSortUnrealizedPnl={setSortUnrealizedPnl}
                sortIsClosed={sortIsClosed}
                setSortIsClosed={setSortIsClosed}
                sortClosedAt={sortClosedAt}
                setSortClosedAt={setSortClosedAt}
                onReset={handleReset}
            />

            <div className="flex flex-col gap-2 md:hidden">
                {resultsTicker?.data.count === 0 && (
                    <GlassPanel className="p-8 text-center text-gray-400">Ничего не найдено</GlassPanel>
                )}
                {resultsTicker?.data.data.map((el) => (
                    <ResultTickerCard key={el.id} ticker={el} />
                ))}
            </div>

            <GlassPanel className="hidden overflow-hidden p-0 md:block">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full divide-y divide-gray-800/50">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="sticky top-0 px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                                    Тикер
                                </th>
                                <th className="sticky top-0 px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                                    Цены
                                </th>
                                <th className="sticky top-0 px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                                    Δ
                                </th>
                                <th className="sticky top-0 px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                                    PNL
                                </th>
                                <th className="sticky top-0 px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                                    SL / TP
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/30 bg-transparent">
                            {resultsTicker?.data.count === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-3 py-10 text-center text-gray-400">
                                        Ничего не найдено
                                    </td>
                                </tr>
                            )}
                            {resultsTicker?.data.data.map((el) => (
                                <ResultTickerRow key={el.id} ticker={el} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassPanel>

            <div className="flex flex-row items-center gap-3">
                <Pagination
                    totalItems={resultsTicker?.data.count}
                    page={page}
                    count={count}
                    handlePageChange={(e) => setPage(e)}
                    handleItemsPerPageChange={(e) => {
                        setPage(1)
                        setCount(Number(e))
                    }}
                />
                {isPending && <p className="text-muted-foreground text-sm">Загрузка...</p>}
            </div>

            <p className="text-muted-foreground px-1 text-xs">
                * SL/TP/Плечо носят информативный характер и не влияют на расчёты
            </p>
        </div>
    )
}
