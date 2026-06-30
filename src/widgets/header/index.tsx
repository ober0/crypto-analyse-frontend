/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client'

import { Button } from '@/components/ui/button'
import { useLogout } from '@/entities/auth/api/use-logout'
import { useIsAuth } from '@/entities/auth/hooks/use-is-auth'
import { useSelf } from '@/entities/user/api/use-self'
import { ROUTES } from '@/shared/router'
import { cn } from '@/shared/utils'
import { Bot, LineChart, Receipt, Wallet } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV_ITEMS = [
    { href: ROUTES.HOME_PAGE, label: 'Прогнозы', icon: LineChart, authOnly: false },
    { href: ROUTES.BOTS_PAGE, label: 'Боты', icon: Bot, authOnly: false },
    { href: ROUTES.USAGE_PAGE, label: 'Траты', icon: Wallet, authOnly: true },
    { href: ROUTES.SUMMARY_PAGE, label: 'Отчеты', icon: Receipt, authOnly: false }
] as const

export const Header = () => {
    const { push } = useRouter()
    const pathname = usePathname()

    const { isAuth, isLoading } = useIsAuth()
    const { data: user } = useSelf()

    const { mutate: logout, isPending: isLoadingLogout } = useLogout()

    const navItems = NAV_ITEMS.filter((item) => isAuth || !item.authOnly)

    return (
        <div className="border-primary/50 bg-background/50 flex w-full flex-col gap-3 rounded-2xl border p-3 backdrop-blur sm:rounded-full sm:p-4 lg:flex-row lg:items-center lg:justify-between">
            <nav className="grid w-full grid-cols-2 gap-1 sm:flex sm:w-auto sm:gap-2">
                {navItems.map(({ href, label, icon: Icon }) => {
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
                <span className="truncate text-sm font-medium text-foreground">
                    {isAuth ? user?.data.username : 'Гость'}
                </span>
                {isAuth ? (
                    <Button
                        variant="destructive"
                        size="sm"
                        className="cursor-target shrink-0"
                        onClick={() => logout()}
                        loading={isLoadingLogout}
                    >
                        Выйти
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-foreground/75 hover:text-foreground shrink-0 border-white/15 bg-white/5 font-normal hover:bg-white/10"
                        onClick={() => push(ROUTES.AUTH_PAGE)}
                        disabled={isLoading}
                    >
                        Войти
                    </Button>
                )}
            </div>
        </div>
    )
}
