import { TickerModels, TickerTimeFrame } from '@/entities/ticker-results/model/ticker'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { useQuery } from '@tanstack/react-query'
import { AxiosPromise } from 'axios'

interface SummaryFilters {
    filters: Partial<{
        tickersId: number
        model: TickerModels
        timeframe: TickerTimeFrame
        closedAt: {
            min: string | undefined
            max: string | undefined
        }
    }>
    groupBy?: SummaryGroupBy[]
}

export type SummaryGroupBy = 'tickersId' | 'timeframe' | 'model'

interface SummaryResponse {
    data: {
        avg: {
            pnl: number
            unrealizedPnl: number
            leverage: number
            difference: number
            unrealizedDifference: number
        }
        count: number
        sum: {
            difference: number
            unrealizedDifference: number
        }
    }
    groupBy: {
        model?: TickerModels
        timeframe?: TickerTimeFrame
        tickersId?: number
        ticker?: {
            id: number
            name: string
            processCount: number
        }
    }
}

const summary = async (data: SummaryFilters): AxiosPromise<SummaryResponse[]> => {
    const res = await apiClient.post('/statistics/generate', data)

    return res
}

export const useGetSummary = (data: SummaryFilters) =>
    useQuery({
        queryKey: [ApiQueryKeys.SUMMARY, data],
        queryFn: () => summary(data)
    })
