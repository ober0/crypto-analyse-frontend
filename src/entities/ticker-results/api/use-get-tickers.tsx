import apiClient from '@/shared/api'
import { AxiosPromise } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { ApiQueryKeys } from '@/shared/config'
import { Ticker } from '../model/ticker'

const availableTickers = async (): AxiosPromise<Ticker[]> => {
    const res = await apiClient.get('/tickers')

    return res
}

export const useAvailableTickers = () =>
    useQuery({
        queryKey: [ApiQueryKeys.TICKERS],
        queryFn: availableTickers
    })
