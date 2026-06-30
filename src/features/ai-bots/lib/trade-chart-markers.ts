import { Trade, TradeActionType, TradeDirection } from '@/entities/ai-processing/model/ai-bot'
import { MarketInterval } from '@/entities/market-data/model/market-data'
import type { CandlestickData, SeriesMarker, Time } from 'lightweight-charts'
import dayjs from 'dayjs'
import { snapToCandleTime } from './chart-utils'

export const buildTradeMarkers = (
    trades: Trade[],
    candles: CandlestickData<Time>[],
    interval: MarketInterval
): SeriesMarker<Time>[] => {
    const markers: SeriesMarker<Time>[] = []

    for (const trade of trades) {
        const openAction = trade.actions.find((action) => action.type === TradeActionType.Open)
        const sellAction = trade.actions.find((action) => action.type === TradeActionType.Sell)
        const buyActions = trade.actions.filter((action) => action.type === TradeActionType.Buy)

        const entryTime = openAction?.createdAt ?? trade.openedAt
        const exitTime = sellAction?.createdAt ?? trade.closedAt

        const isLong = trade.direction === TradeDirection.Long

        if (entryTime) {
            const time = snapToCandleTime(entryTime, candles, interval)
            if (time != null) {
                markers.push({
                    time,
                    position: isLong ? 'belowBar' : 'aboveBar',
                    color: isLong ? '#22c55e' : '#ef4444',
                    shape: isLong ? 'arrowUp' : 'arrowDown',
                    text: `Вход #${trade.id}`
                })
            }
        }

        for (const action of buyActions) {
            const time = snapToCandleTime(action.createdAt, candles, interval)
            if (time != null) {
                markers.push({
                    time,
                    position: isLong ? 'belowBar' : 'aboveBar',
                    color: isLong ? '#16a34a' : '#dc2626',
                    shape: 'circle',
                    text: `Докупка #${trade.id}`
                })
            }
        }

        if (exitTime) {
            const time = snapToCandleTime(exitTime, candles, interval)
            if (time != null) {
                markers.push({
                    time,
                    position: isLong ? 'aboveBar' : 'belowBar',
                    color: '#94a3b8',
                    shape: 'circle',
                    text: `Выход #${trade.id}`
                })
            }
        }
    }

    return markers.sort((a, b) => {
        const aTime = typeof a.time === 'number' ? a.time : dayjs(String(a.time)).unix()
        const bTime = typeof b.time === 'number' ? b.time : dayjs(String(b.time)).unix()

        return aTime - bTime
    })
}
