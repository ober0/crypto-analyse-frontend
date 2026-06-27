import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { useQuery } from '@tanstack/react-query'
import { AxiosPromise } from 'axios'
import { ModelUsageTotal } from '../model/usage'

const getUsageTotal = async (): AxiosPromise<ModelUsageTotal[]> => {
    const res = await apiClient.get('/ticker-results/usage/total')

    return res
}

export const useGetUsageTotal = () =>
    useQuery({
        queryKey: [ApiQueryKeys.USAGE_TOTAL],
        queryFn: getUsageTotal
    })
