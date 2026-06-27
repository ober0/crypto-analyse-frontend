import apiClient from '@/shared/api'
import { ApiQueryKeys, GLOBAL_DICTIONARY } from '@/shared/config'
import { ROUTES } from '@/shared/router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

interface LogoutRequest {
    refreshToken: string
}

const logout = async (data: LogoutRequest) => {
    const res = await apiClient.post('/auth/logout', data, { withCredentials: true })

    return res
}

export const useLogout = () => {
    const { push } = useRouter()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.LOGOUT],
        mutationFn: logout,
        onSuccess: () => {
            queryClient.clear()
            toast.success('Вы вышли из аккаунта')
            push(ROUTES.AUTH_PAGE)
            Cookies.remove(GLOBAL_DICTIONARY.ACCESS_TOKEN)
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            const errorMessage = error.response?.data?.message || error.message || 'Неизвестная ошибка!'
            toast.error(errorMessage)
        }
    })
}
