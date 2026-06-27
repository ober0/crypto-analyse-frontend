import { useSelf } from '@/entities/user/api/use-self'

export const useIsAuth = () => {
    const { isError, isLoading } = useSelf()

    return { isAuth: !isError, isLoading }
}
