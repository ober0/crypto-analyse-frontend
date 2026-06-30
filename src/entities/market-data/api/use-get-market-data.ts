import { ApiQueryKeys } from '@/shared/config'
import { useQuery } from '@tanstack/react-query'
import { API_MAX_CANDLES, MarketDataParams } from '../model/market-data'
import { getMarketData } from './fetch-market-data'

export { API_MAX_CANDLES } from '../model/market-data'
export { fetchMarketDataPages, getMarketData } from './fetch-market-data'

export const useGetMarketData = (params: MarketDataParams | null) =>
    useQuery({
        queryKey: [
            ApiQueryKeys.MARKET_DATA,
            params?.symbolId,
            params?.interval,
            params?.page,
            params?.candles ?? API_MAX_CANDLES
        ],
        queryFn: () => {
            if (!params) {
                throw new Error('Market data params are required')
            }

            return getMarketData(params)
        },
        enabled: params != null && params.symbolId > 0
    })
