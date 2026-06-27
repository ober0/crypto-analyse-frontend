import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { RequestData, ResponseData } from '@/shared/types'
import { ResultTicker, TickerModels } from '../model/ticker'
import { useQuery } from '@tanstack/react-query'

interface ResultsTickersFilters {
    createdAt?: {
        min?: string
        max?: string
    }
    closedAt?: {
        min?: string
        max?: string
    }
    tickersIds?: number[]
    model?: TickerModels
    isClosed?: boolean
}

const resultsTickers = async (data: RequestData<ResultTicker, ResultsTickersFilters>): ResponseData<ResultTicker[]> => {
    const res = await apiClient.post('/ticker-results/search', data)

    return res
}

export const useResultsTickers = (data: RequestData<ResultTicker, ResultsTickersFilters>) =>
    useQuery({
        queryKey: [ApiQueryKeys.RESULTS_TICKERS, data],
        queryFn: () => resultsTickers(data)
    })
