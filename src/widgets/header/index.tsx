/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client'

import { Button } from '@/components/ui/button'
import { useLogout } from '@/entities/auth/api/use-logout'
import { ROUTES } from '@/shared/router'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useIsAuth } from '@/entities/auth/hooks/use-is-auth'
import { useSelf } from '@/entities/user/api/use-self'
import { cn } from '@/shared/utils'

const NAV_ITEMS = [
    { href: ROUTES.HOME_PAGE, label: 'Прогнозы' },
    { href: ROUTES.USAGE_PAGE, label: 'Траты' },
    { href: ROUTES.SUMMARY_PAGE, label: 'Отчеты' }
] as const

export const Header = () => {
    const { push } = useRouter()
    const pathname = usePathname()

    const { isAuth } = useIsAuth()
    const { data: user } = useSelf()

    const { mutate: logout, isPending: isLoadingLogout } = useLogout()

    return (
        <div className="border-primary/50 bg-background/50 flex w-full flex-col items-center justify-between gap-1 rounded-full border p-4 backdrop-blur lg:flex-row">
            <div className="flex flex-row flex-wrap items-center gap-2">
                {NAV_ITEMS.map(({ href, label }) => {
                    const isActive = pathname === href

                    return (
                        <Link key={href} href={href}>
                            <Button
                                variant={isActive ? 'default' : 'link'}
                                className={cn('cursor-target', !isActive && 'text-muted-foreground')}
                            >
                                {label}
                            </Button>
                        </Link>
                    )
                })}
            </div>
            <div className="flex flex-row items-center gap-3">
                {isAuth && user?.data.username}
                <Button
                    variant={isAuth ? 'destructive' : 'ghost'}
                    className="cursor-target"
                    onClick={() => {
                        if (isAuth) {
                            logout()
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
