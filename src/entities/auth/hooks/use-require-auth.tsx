'use client'

import { ROUTES } from '@/shared/router'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useIsAuth } from './use-is-auth'

export const useRequireAuth = () => {
    const { push } = useRouter()
    const { isAuth, isLoading } = useIsAuth()

    useEffect(() => {
        if (!isLoading && !isAuth) {
            push(ROUTES.AUTH_PAGE)
        }
    }, [isAuth, isLoading, push])

    return { canRender: !isLoading && isAuth, isLoading }
}
