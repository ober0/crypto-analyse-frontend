'use client'

import { PageHeader, PageSection } from '@/components/page-layout'
import SplitText from '@/components/SplitText'
import { Loader } from '@/components/loader'
import { useIsAuth } from '@/entities/auth/hooks/use-is-auth'
import { AvailableTickers } from '@/features/tickers'
import { ResultsTickersList } from '@/features/result-tickers'
import { ROUTES } from '@/shared/router'
import { useRouter } from 'next/navigation'

export default function Home() {
    const { push } = useRouter()
    const { isAuth, isLoading } = useIsAuth()

    if (isLoading) return <Loader />

    if (!isAuth) return push(ROUTES.AUTH_PAGE)

    return (
        <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-4">
                <PageHeader
                    title="Прогнозы"
                    description="AI-анализ тикеров и последние торговые сигналы"
                />
                <SplitText
                    text="Стал ли ты сегодня миллионером или снова нет?"
                    className="text-muted-foreground text-center text-lg font-medium italic"
                    delay={40}
                    duration={0.3}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 30 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                />
            </div>

            <PageSection title="Последние запросы" description="История прогнозов с фильтрами и сортировкой">
                <ResultsTickersList />
            </PageSection>

            <PageSection title="Доступные тикеры" description="Пары, доступные для анализа">
                <AvailableTickers />
            </PageSection>
        </div>
    )
}
