import apiClient from '@/shared/api'
import { API_MAX_CANDLES, MarketCandle, MarketDataParams, MarketInterval } from '../model/market-data'

export const getMarketData = async ({
    symbolId,
    interval,
    page,
    candles = API_MAX_CANDLES
}: MarketDataParams): Promise<MarketCandle[]> => {
    const res = await apiClient.get<MarketCandle[]>(`/market-data/${symbolId}`, {
        params: {
            candles: Math.min(candles, API_MAX_CANDLES),
            interval,
            page
        }
    })

    return res.data
}

export const fetchMarketDataPages = async (
    symbolId: number,
    interval: MarketInterval,
    fromPage: number,
    pageCount: number
): Promise<MarketCandle[]> => {
    if (pageCount <= 0) return []

    const pages = await Promise.all(
        Array.from({ length: pageCount }, (_, index) =>
            getMarketData({
                symbolId,
                interval,
                page: fromPage + index,
                candles: API_MAX_CANDLES
            })
        )
    )

    return pages.flat()
}
