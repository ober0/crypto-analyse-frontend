import axios from 'axios'
import Cookies from 'js-cookie'
import { AUTH_CONGIG, GLOBAL_DICTIONARY } from '../config'
import { refreshTokens } from '@/entities/auth/api/use-refresh'

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
})

// Добавление токена в запрос
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const accessToken = Cookies.get(GLOBAL_DICTIONARY.ACCESS_TOKEN)
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`
            }
            return config
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Обработка ответов
let refreshTokenAttempts = 0

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (typeof window !== 'undefined') {
            if (error.response.status === 401 && !originalRequest._retry) {
                if (refreshTokenAttempts >= 3) {
                    return Promise.reject(error)
                }

                originalRequest._retry = true
                refreshTokenAttempts += 1

                try {
                    const { accessToken } = (await refreshTokens()).data

                    Cookies.set(GLOBAL_DICTIONARY.ACCESS_TOKEN, accessToken, {
                        expires: AUTH_CONGIG.ACCESS_TOKEN_LIFETIME
                    })

                    refreshTokenAttempts = 0

                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

                    return apiClient(originalRequest)
                } catch (refreshError) {
                    return Promise.reject(refreshError)
                }
            }
        }

        return Promise.reject(error)
    }
)

export const apiServerClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: false
})
apiServerClient.interceptors.request.use((config) => {
    if (config.headers?.cookie) {
        delete config.headers.cookie
    }
    return config
})

export default apiClient
