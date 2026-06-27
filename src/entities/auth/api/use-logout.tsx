import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { ROUTES } from '@/shared/router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const logout = async () => {
    const res = await apiClient.post('/auth/logout')

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
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            const errorMessage = error.response?.data?.message || error.message || 'Неизвестная ошибка!'
            toast.error(errorMessage)
        }
    })
}
