import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { useQuery } from '@tanstack/react-query'
import { AxiosPromise } from 'axios'
import { ModelUsageTotal } from '@/entities/ticker-results/model/usage'

const getAiUsageTotal = async (): AxiosPromise<ModelUsageTotal[]> => {
    const res = await apiClient.get('/ai-processing/usage/total')

    return res
}

export const useGetAiUsageTotal = () =>
    useQuery({
        queryKey: [ApiQueryKeys.AI_USAGE_TOTAL],
        queryFn: getAiUsageTotal
    })
