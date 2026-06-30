export const MARKET_INTERVALS = ['1', '15', '60', 'D', 'W'] as const

export type MarketInterval = (typeof MARKET_INTERVALS)[number]

export const API_MAX_CANDLES = 100

export const MARKET_INTERVAL_LABELS: Record<MarketInterval, string> = {
    '1': '1м',
    '15': '15м',
    '60': '1ч',
    D: '1д',
    W: '1н'
}

export interface MarketCandle {
    time: string
    open: number
    high: number
    low: number
    close: number
    volume: number
}

export interface MarketDataParams {
    symbolId: number
    interval: MarketInterval
    page: number
    candles?: number
}
