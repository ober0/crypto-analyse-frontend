import { isAxiosError } from 'axios'

export const getAxiosErrorMessage = (error: Error, fallback: string) => {
    if (isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message || fallback
    }

    return fallback
}
