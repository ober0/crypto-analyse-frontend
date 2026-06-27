/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client'

import { Button } from '@/components/ui/button'
import { useLogout } from '@/entities/auth/api/use-logout'
import { ROUTES } from '@/shared/router'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { GLOBAL_DICTIONARY } from '@/shared/config'
import { useIsAuth } from '@/entities/auth/hooks/use-is-auth'
import { useSelf } from '@/entities/user/api/use-self'

export const Header = () => {
    const { push } = useRouter()

    const isAuth = useIsAuth()
    const { data: user } = useSelf()

    const refreshToken = Cookies.get(GLOBAL_DICTIONARY.REFRESH_TOKEN)
    const { mutate: logout, isPending: isLoadingLogout } = useLogout()

    return (
        <div className="border-primary/50 bg-background/50 flex w-full flex-col items-center justify-between gap-1 rounded-full border p-4 backdrop-blur lg:flex-row">
            <div className="flex flex-row items-center gap-5">
                <Link href={ROUTES.HOME_PAGE}>
                    <p className="cursor-target italic hover:underline">everyday_forecast</p>
                </Link>
                <Link href={ROUTES.SUMMARY_PAGE} className="w-full">
                    <Button className="w-full" variant={'link'}>
                        Отчеты
                    </Button>
                </Link>
            </div>
            <div className="flex flex-row items-center gap-3">
                {isAuth && user?.data.username}
                <Button
                    variant={isAuth ? 'destructive' : 'ghost'}
                    className="cursor-target"
                    onClick={() => {
                        if (isAuth) {
                            logout({ refreshToken: refreshToken || '' })
                        } else {
                            push(ROUTES.AUTH_PAGE)
                        }
                    }}
                    loading={isLoadingLogout}
                >
                    {isAuth ? 'Выйти' : 'Логин'}
                </Button>
            </div>
        </div>
    )
}
