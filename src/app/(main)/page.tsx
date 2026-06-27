'use client'

import { ROUTES } from '@/shared/router'
import { useRouter } from 'next/navigation'
import SplitText from '@/components/SplitText'
import { useIsAuth } from '@/entities/auth/hooks/use-is-auth'
import { Loader } from '@/components/loader'
import { AvailableTickers } from '@/features/tickers'
import { ResultsTickersList } from '@/features/result-tickers'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
    const { push } = useRouter()

    const { isAuth, isLoading } = useIsAuth()

    if (isLoading) return <Loader />

    if (!isAuth) return push(ROUTES.AUTH_PAGE)

    return (
        <div className="flex w-full flex-col gap-5">
            <SplitText
                text="Стал ли ты сегодня миллионером или снова нет?"
                className="text-center text-2xl font-semibold"
                delay={50}
                duration={0.3}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
            />
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold">Последние запросы:</h2>
                <ResultsTickersList />
            </div>
            <Link href={ROUTES.SUMMARY_PAGE} className="w-full">
                <Button className="w-full">Отчеты</Button>
            </Link>
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold">Доступные тикеры:</h2>
                <AvailableTickers />
            </div>
        </div>
    )
}
