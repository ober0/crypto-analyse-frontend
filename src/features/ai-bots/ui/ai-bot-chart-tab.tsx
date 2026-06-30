'use client'

import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Trade } from '@/entities/ai-processing/model/ai-bot'
import { fetchMarketDataPages, getMarketData } from '@/entities/market-data/api/fetch-market-data'
import {
    API_MAX_CANDLES,
    MARKET_INTERVAL_LABELS,
    MARKET_INTERVALS,
    MarketCandle,
    MarketInterval
} from '@/entities/market-data/model/market-data'
import { ApiQueryKeys } from '@/shared/config'
import { cn } from '@/shared/utils'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useRef, useState } from 'react'
import { getCandlesPerPage, getInitialPagesCount, normalizeCandles } from '../lib/chart-utils'
import { BotCandlestickChart } from './bot-candlestick-chart'

interface AiBotChartTabProps {
    symbolId: number
    tickerName: string
    trades: Trade[]
}

const CHART_LEGEND = [
    { label: 'Вход long', color: 'bg-green-500' },
    { label: 'Вход short', color: 'bg-red-500' },
    { label: 'Докупка', color: 'bg-emerald-700' },
    { label: 'Выход', color: 'bg-slate-400' }
] as const

export const AiBotChartTab = ({ symbolId, tickerName, trades }: AiBotChartTabProps) => {
    const [interval, setInterval] = useState<MarketInterval>('15')

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-muted-foreground text-xs">
                    {tickerName} · данные из Market Data
                </p>
                <div className="flex flex-wrap gap-1">
                    {MARKET_INTERVALS.map((value) => (
                        <Button
                            key={value}
                            size="sm"
                            variant={interval === value ? 'default' : 'ghost'}
                            className={cn(
                                'h-7 rounded-lg px-2.5 text-xs',
                                interval !== value && 'text-muted-foreground'
                            )}
                            onClick={() => setInterval(value)}
                        >
                            {MARKET_INTERVAL_LABELS[value]}
                        </Button>
                    ))}
                </div>
            </div>

            <ChartMarketSession
                key={`${symbolId}-${interval}`}
                symbolId={symbolId}
                interval={interval}
                trades={trades}
            />
        </div>
    )
}

const ChartMarketSession = ({
    symbolId,
    interval,
    trades
}: {
    symbolId: number
    interval: MarketInterval
    trades: Trade[]
}) => {
    const initialPages = getInitialPagesCount()
    const [olderCandles, setOlderCandles] = useState<MarketCandle[]>([])
    const [nextHistoryPage, setNextHistoryPage] = useState(initialPages)
    const [hasMoreHistory, setHasMoreHistory] = useState(true)
    const [loadingHistory, setLoadingHistory] = useState(false)
    const loadingHistoryRef = useRef(false)

    const initial = useQuery({
        queryKey: [ApiQueryKeys.MARKET_DATA, 'chart-initial', symbolId, interval, initialPages],
        queryFn: () => fetchMarketDataPages(symbolId, interval, 0, initialPages),
        enabled: symbolId > 0,
        staleTime: 60_000
    })

    const candles = useMemo(
        () => normalizeCandles([...olderCandles, ...(initial.data ?? [])], interval),
        [initial.data, interval, olderCandles]
    )

    const loadMoreHistory = useCallback(async () => {
        if (loadingHistoryRef.current || !hasMoreHistory || symbolId <= 0) return

        loadingHistoryRef.current = true
        setLoadingHistory(true)

        try {
            const page = await getMarketData({
                symbolId,
                interval,
                page: nextHistoryPage,
                candles: getCandlesPerPage()
            })

            if (page.length === 0) {
                setHasMoreHistory(false)
                return
            }

            setOlderCandles((prevOlder) => {
                const beforeCount = normalizeCandles(
                    [...prevOlder, ...(initial.data ?? [])],
                    interval
                ).length

                const nextOlder = [...prevOlder, ...page]
                const afterCount = normalizeCandles(
                    [...nextOlder, ...(initial.data ?? [])],
                    interval
                ).length

                if (afterCount === beforeCount) {
                    setHasMoreHistory(false)
                }

                return nextOlder
            })

            setNextHistoryPage((prev) => prev + 1)

            if (page.length < API_MAX_CANDLES) {
                setHasMoreHistory(false)
            }
        } catch {
            // повтор при следующем скролле
        } finally {
            loadingHistoryRef.current = false
            setLoadingHistory(false)
        }
    }, [hasMoreHistory, initial.data, interval, nextHistoryPage, symbolId])

    if (initial.isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader />
            </div>
        )
    }

    if (initial.isError) {
        return (
            <p className="text-muted-foreground py-8 text-center text-sm">
                Не удалось загрузить график
            </p>
        )
    }

    return (
        <>
            <BotCandlestickChart
                candles={candles}
                trades={trades}
                interval={interval}
                loadingMore={loadingHistory}
                onLoadMore={hasMoreHistory ? loadMoreHistory : undefined}
                hasMore={hasMoreHistory}
            />

            <div className="flex flex-wrap gap-3 text-[11px]">
                {CHART_LEGEND.map((item) => (
                    <span key={item.label} className="text-muted-foreground flex items-center gap-1.5">
                        <span className={cn('size-2 rounded-full', item.color)} />
                        {item.label}
                    </span>
                ))}
                <span className="text-muted-foreground">
                    {candles.length} свечей · старт {initialPages * API_MAX_CANDLES} · прокрутите влево для истории
                </span>
            </div>
        </>
    )
}
