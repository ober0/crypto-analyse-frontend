import { MarketCandle, MarketInterval } from '@/entities/market-data/model/market-data'
import { CandlestickData, Time, UTCTimestamp } from 'lightweight-charts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const CANDLES_PER_PAGE = 100

export const CHART_INITIAL_CANDLES = 200
export const CHART_INITIAL_PAGES = CHART_INITIAL_CANDLES / CANDLES_PER_PAGE

export const getCandlesPerPage = () => CANDLES_PER_PAGE
export const getInitialPagesCount = () => CHART_INITIAL_PAGES

export const toChartTime = (isoTime: string, interval: MarketInterval): Time => {
    const date = dayjs(isoTime).utc()

    if (interval === 'D' || interval === 'W') {
        return date.format('YYYY-MM-DD')
    }

    return Math.floor(date.valueOf() / 1000) as UTCTimestamp
}

export const candleToChartData = (candle: MarketCandle, interval: MarketInterval): CandlestickData<Time> => ({
    time: toChartTime(candle.time, interval),
    open: Number(candle.open),
    high: Number(candle.high),
    low: Number(candle.low),
    close: Number(candle.close)
})

const timeToUnix = (time: Time) => {
    if (typeof time === 'number') return time
    if (typeof time === 'string') return dayjs(time).unix()

    return dayjs(`${time.year}-${time.month}-${time.day}`).unix()
}

export const normalizeCandles = (candles: MarketCandle[], interval: MarketInterval): CandlestickData<Time>[] => {
    const unique = new Map<string, CandlestickData<Time>>()

    for (const candle of candles) {
        const point = candleToChartData(candle, interval)
        unique.set(String(point.time), point)
    }

    return [...unique.values()].sort((a, b) => timeToUnix(a.time) - timeToUnix(b.time))
}

export const mergeChartCandles = (
    current: CandlestickData<Time>[],
    incoming: CandlestickData<Time>[]
): CandlestickData<Time>[] => {
    const unique = new Map<string, CandlestickData<Time>>()

    for (const candle of [...current, ...incoming]) {
        unique.set(String(candle.time), candle)
    }

    return [...unique.values()].sort((a, b) => timeToUnix(a.time) - timeToUnix(b.time))
}

export const snapToCandleTime = (
    isoTime: string,
    candles: CandlestickData<Time>[],
    interval: MarketInterval
): Time | null => {
    if (candles.length === 0) return null

    const targetUnix = timeToUnix(toChartTime(isoTime, interval))
    let best = candles[0].time
    let bestDiff = Math.abs(timeToUnix(best) - targetUnix)

    for (const candle of candles) {
        const diff = Math.abs(timeToUnix(candle.time) - targetUnix)
        if (diff < bestDiff) {
            bestDiff = diff
            best = candle.time
        }
    }

    return best
}
