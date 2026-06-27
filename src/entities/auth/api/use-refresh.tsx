import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { useMutation } from '@tanstack/react-query'
import { AxiosPromise } from 'axios'

export const refreshTokens = async (): AxiosPromise<void> => {
    const res = await apiClient.post('/auth/refresh')

    return res
}

export const useRefresh = () => {
    return useMutation({
        mutationKey: [ApiQueryKeys.REFRESH],
        mutationFn: refreshTokens
    })
}
