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
import { Bot, LineChart, Receipt, Wallet } from 'lucide-react'

const NAV_ITEMS = [
    { href: ROUTES.HOME_PAGE, label: 'Прогнозы', icon: LineChart },
    { href: ROUTES.BOTS_PAGE, label: 'Боты', icon: Bot },
    { href: ROUTES.USAGE_PAGE, label: 'Траты', icon: Wallet },
    { href: ROUTES.SUMMARY_PAGE, label: 'Отчеты', icon: Receipt }
] as const

export const Header = () => {
    const { push } = useRouter()
    const pathname = usePathname()

    const { isAuth } = useIsAuth()
    const { data: user } = useSelf()

    const { mutate: logout, isPending: isLoadingLogout } = useLogout()

    return (
        <div className="border-primary/50 bg-background/50 flex w-full flex-col gap-3 rounded-2xl border p-3 backdrop-blur sm:rounded-full sm:p-4 lg:flex-row lg:items-center lg:justify-between">
            <nav className="grid w-full grid-cols-2 gap-1 sm:flex sm:w-auto sm:gap-2">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href

                    return (
                        <Link key={href} href={href} className="min-w-0">
                            <Button
                                variant={isActive ? 'default' : 'ghost'}
                                size="sm"
                                className={cn(
                                    'cursor-target w-full gap-1.5 truncate px-2 sm:w-auto sm:px-3',
                                    !isActive && 'text-muted-foreground'
                                )}
                            >
                                <Icon className="size-3.5 shrink-0 sm:size-4" />
                                {label}
                            </Button>
                        </Link>
                    )
                })}
            </nav>

            <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end sm:gap-3">
                {isAuth && (
                    <span className="text-muted-foreground truncate text-sm">{user?.data.username}</span>
                )}
                <Button
                    variant={isAuth ? 'destructive' : 'ghost'}
                    size="sm"
                    className="cursor-target shrink-0"
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
