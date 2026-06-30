'use client'

import { Trade } from '@/entities/ai-processing/model/ai-bot'
import { MarketInterval } from '@/entities/market-data/model/market-data'
import { cn } from '@/shared/utils'
import {
    CandlestickData,
    CandlestickSeries,
    ColorType,
    createChart,
    createSeriesMarkers,
    type IChartApi,
    type ISeriesApi,
    type ISeriesMarkersPluginApi,
    type Time
} from 'lightweight-charts'
import { useEffect, useRef } from 'react'
import { buildTradeMarkers } from '../lib/trade-chart-markers'

interface BotCandlestickChartProps {
    candles: CandlestickData<Time>[]
    trades: Trade[]
    interval: MarketInterval
    loading?: boolean
    loadingMore?: boolean
    onLoadMore?: () => void
    hasMore?: boolean
}

export const BotCandlestickChart = ({
    candles,
    trades,
    interval,
    loading,
    loadingMore,
    onLoadMore,
    hasMore
}: BotCandlestickChartProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
    const markersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null)
    const prevLengthRef = useRef(0)
    const loadingMoreRef = useRef(false)
    const userInteractedRef = useRef(false)
    const loadMoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        loadingMoreRef.current = Boolean(loadingMore)
    }, [loadingMore])

    useEffect(() => {
        if (!containerRef.current) return

        const chart = createChart(containerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#9ca3af',
                fontSize: 11
            },
            grid: {
                vertLines: { color: 'rgba(255,255,255,0.05)' },
                horzLines: { color: 'rgba(255,255,255,0.05)' }
            },
            rightPriceScale: {
                borderColor: 'rgba(255,255,255,0.1)'
            },
            timeScale: {
                borderColor: 'rgba(255,255,255,0.1)',
                timeVisible: true,
                secondsVisible: interval === '1'
            },
            crosshair: {
                vertLine: { color: 'rgba(255,255,255,0.2)' },
                horzLine: { color: 'rgba(255,255,255,0.2)' }
            }
        })

        const series = chart.addSeries(CandlestickSeries, {
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderUpColor: '#22c55e',
            borderDownColor: '#ef4444',
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444'
        })

        const markers = createSeriesMarkers(series, [])

        chartRef.current = chart
        seriesRef.current = series
        markersRef.current = markers

        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0]
            if (!entry) return
            chart.applyOptions({ width: entry.contentRect.width, height: entry.contentRect.height })
        })

        resizeObserver.observe(containerRef.current)

        const markUserInteraction = () => {
            userInteractedRef.current = true
        }

        containerRef.current.addEventListener('wheel', markUserInteraction, { passive: true })
        containerRef.current.addEventListener('pointerdown', markUserInteraction)

        const handleVisibleRangeChange = () => {
            if (!onLoadMore || !hasMore || loadingMoreRef.current || !userInteractedRef.current) return

            const logicalRange = chart.timeScale().getVisibleLogicalRange()
            if (!logicalRange || logicalRange.from > 8) return

            if (loadMoreTimerRef.current) clearTimeout(loadMoreTimerRef.current)

            loadMoreTimerRef.current = setTimeout(() => {
                if (!onLoadMore || !hasMore || loadingMoreRef.current) return
                loadingMoreRef.current = true
                onLoadMore()
            }, 250)
        }

        chart.timeScale().subscribeVisibleLogicalRangeChange(handleVisibleRangeChange)

        return () => {
            if (loadMoreTimerRef.current) clearTimeout(loadMoreTimerRef.current)
            containerRef.current?.removeEventListener('wheel', markUserInteraction)
            containerRef.current?.removeEventListener('pointerdown', markUserInteraction)
            resizeObserver.disconnect()
            chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleVisibleRangeChange)
            markers.detach()
            chart.remove()
            chartRef.current = null
            seriesRef.current = null
            markersRef.current = null
            prevLengthRef.current = 0
            userInteractedRef.current = false
        }
    }, [hasMore, interval, onLoadMore])

    useEffect(() => {
        const chart = chartRef.current
        const series = seriesRef.current
        const markers = markersRef.current

        if (!chart || !series || !markers) return

        if (candles.length === 0) {
            series.setData([])
            markers.setMarkers([])
            prevLengthRef.current = 0
            return
        }

        const wasPrepended = candles.length > prevLengthRef.current && prevLengthRef.current > 0
        const logicalRange = wasPrepended ? chart.timeScale().getVisibleLogicalRange() : null
        const addedCount = wasPrepended ? candles.length - prevLengthRef.current : 0

        series.setData(candles)
        markers.setMarkers(buildTradeMarkers(trades, candles, interval))

        if (wasPrepended && logicalRange) {
            chart.timeScale().setVisibleLogicalRange({
                from: logicalRange.from + addedCount,
                to: logicalRange.to + addedCount
            })
        } else if (prevLengthRef.current === 0) {
            chart.timeScale().fitContent()
        }

        prevLengthRef.current = candles.length
    }, [candles, trades, interval])

    return (
        <div className="relative h-[min(420px,50vh)] min-h-[280px] w-full">
            <div ref={containerRef} className="absolute inset-0" />
            {(loading || loadingMore) && (
                <div className="bg-background/40 pointer-events-none absolute inset-0 flex items-center justify-center text-xs">
                    <span className={cn('rounded-full border border-white/10 bg-black/60 px-3 py-1')}>
                        {loadingMore ? 'Загрузка истории' : 'Загрузка графика'}
                    </span>
                </div>
            )}
            {!loading && candles.length === 0 && (
                <div className="text-muted-foreground absolute inset-0 flex items-center justify-center text-sm">
                    Нет данных для графика
                </div>
            )}
        </div>
    )
}
