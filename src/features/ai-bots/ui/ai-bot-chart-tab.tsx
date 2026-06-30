'use client'

import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Trade } from '@/entities/ai-processing/model/ai-bot'
import { useGetMarketData } from '@/entities/market-data/api/use-get-market-data'
import {
    MARKET_INTERVAL_LABELS,
    MARKET_INTERVALS,
    MarketInterval
} from '@/entities/market-data/model/market-data'
import { cn } from '@/shared/utils'
import { CandlestickData, Time } from 'lightweight-charts'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getCandlesPerPage, mergeChartCandles, normalizeCandles } from '../lib/chart-utils'
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
    const [page, setPage] = useState(0)
    const [candles, setCandles] = useState<CandlestickData<Time>[]>([])
    const [hasMore, setHasMore] = useState(true)
    const loadingMoreRef = useRef(false)

    const { data, isLoading, isFetching } = useGetMarketData(
        symbolId > 0
            ? {
                  symbolId,
                  interval,
                  page,
                  candles: getCandlesPerPage()
              }
            : null
    )

    /* eslint-disable react-hooks/set-state-in-effect -- синхронизация страниц API с локальным массивом свечей */
    useEffect(() => {
        if (!data) return

        const normalized = normalizeCandles(data, interval)
        setHasMore(normalized.length >= getCandlesPerPage())
        setCandles((prev) => (page === 0 ? normalized : mergeChartCandles(prev, normalized)))
        loadingMoreRef.current = false
    }, [data, interval, page])
    /* eslint-enable react-hooks/set-state-in-effect */

    const handleLoadMore = useCallback(() => {
        if (!hasMore || isFetching || loadingMoreRef.current) return

        loadingMoreRef.current = true
        setPage((prev) => prev + 1)
    }, [hasMore, isFetching])

    const isInitialLoading = isLoading && page === 0 && candles.length === 0

    if (isInitialLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader />
            </div>
        )
    }

    return (
        <>
            <BotCandlestickChart
                candles={candles}
                trades={trades}
                interval={interval}
                loading={isInitialLoading}
                loadingMore={isFetching && page > 0}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
            />

            <div className="flex flex-wrap gap-3 text-[11px]">
                {CHART_LEGEND.map((item) => (
                    <span key={item.label} className="text-muted-foreground flex items-center gap-1.5">
                        <span className={cn('size-2 rounded-full', item.color)} />
                        {item.label}
                    </span>
                ))}
                <span className="text-muted-foreground">
                    {candles.length} свечей · прокрутите влево для загрузки истории
                </span>
            </div>
        </>
    )
}
