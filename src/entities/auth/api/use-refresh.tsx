import apiClient from '@/shared/api'
import { ApiQueryKeys, GLOBAL_DICTIONARY } from '@/shared/config'
import { useMutation } from '@tanstack/react-query'
import { AxiosPromise } from 'axios'
import Cookies from 'js-cookie'

interface RefreshResponse {
    accessToken: string
}

export const refreshTokens = async (): AxiosPromise<RefreshResponse> => {
    const res = await apiClient.post('/auth/refresh', {}, { withCredentials: true })

    return res
}

export const useRefresh = () => {
    return useMutation({
        mutationKey: [ApiQueryKeys.REFRESH],
        mutationFn: refreshTokens,
        onSuccess: (response) => {
            Cookies.set(GLOBAL_DICTIONARY.ACCESS_TOKEN, response.data.accessToken)
        }
    })
}
