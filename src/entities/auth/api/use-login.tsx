import { User } from '@/entities/user/model/user'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { ROUTES } from '@/shared/router'
import { useMutation } from '@tanstack/react-query'
import { AxiosError, AxiosPromise } from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface LoginRequest {
    username: string
    password: string
}

interface LoginResponse {
    user: User
}

const login = async (data: LoginRequest): AxiosPromise<LoginResponse> => {
    const res = await apiClient.post('/auth/login', data)

    return res
}

export const useLogin = () => {
    const { push } = useRouter()

    return useMutation({
        mutationKey: [ApiQueryKeys.LOGIN],
        mutationFn: login,
        onSuccess: () => {
            toast.success('Успешный вход')
            push(ROUTES.HOME_PAGE)
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            const errorMessage = error.response?.data?.message || error.message || 'Неизвестная ошибка!'
            toast.error(errorMessage)
        }
    })
}
