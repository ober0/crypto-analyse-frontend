import axios from 'axios'
import { refreshTokens } from '@/entities/auth/api/use-refresh'

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true
})

let refreshTokenAttempts = 0

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (typeof window !== 'undefined' && error.response?.status === 401 && !originalRequest._retry) {
            if (refreshTokenAttempts >= 3) {
                return Promise.reject(error)
            }

            originalRequest._retry = true
            refreshTokenAttempts += 1

            try {
                await refreshTokens()
                refreshTokenAttempts = 0
                return apiClient(originalRequest)
            } catch (refreshError) {
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export const apiServerClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true
})
apiServerClient.interceptors.request.use((config) => {
    if (config.headers?.cookie) {
        delete config.headers.cookie
    }
    return config
})

export default apiClient
