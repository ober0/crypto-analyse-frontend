import { useSelf } from '@/entities/user/api/use-self'

export const useIsAuth = () => {
    const { isSuccess, isLoading } = useSelf()

    return { isAuth: isSuccess, isLoading }
}
