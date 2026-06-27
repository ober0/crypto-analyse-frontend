import { User } from '@/entities/user/model/user'
import apiClient from '@/shared/api'
import { ApiQueryKeys, AUTH_CONGIG, GLOBAL_DICTIONARY } from '@/shared/config'
import { ROUTES } from '@/shared/router'
import { useMutation } from '@tanstack/react-query'
import { AxiosError, AxiosPromise } from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

interface LoginRequest {
    username: string
    password: string
}

interface LoginResponse {
    accessToken: string
    user: User
}

const login = async (data: LoginRequest): AxiosPromise<LoginResponse> => {
    const res = await apiClient.post('/auth/login', data, { withCredentials: true })

    return res
}

export const useLogin = () => {
    const { push } = useRouter()

    return useMutation({
        mutationKey: [ApiQueryKeys.LOGIN],
        mutationFn: login,
        onSuccess: (response) => {
            toast.success('Успешный вход')
            push(ROUTES.HOME_PAGE)

            if (response.data.accessToken) {
                Cookies.set(GLOBAL_DICTIONARY.ACCESS_TOKEN, response.data.accessToken, {
                    secure: true,
                    expires: AUTH_CONGIG.ACCESS_TOKEN_LIFETIME
                })
            }
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            const errorMessage = error.response?.data?.message || error.message || 'Неизвестная ошибка!'
            toast.error(errorMessage)
        }
    })
}
