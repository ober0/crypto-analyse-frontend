'use client'

import { PageHeader, PageSection } from '@/components/page-layout'
import SplitText from '@/components/SplitText'
import { AvailableTickers } from '@/features/tickers'
import { ResultsTickersList } from '@/features/result-tickers'

export default function Home() {
    return (
        <div className="flex w-full flex-col gap-6 sm:gap-8">
            <div className="flex flex-col gap-4">
                <PageHeader
                    title="Прогнозы"
                    description="AI-анализ тикеров и последние торговые сигналы"
                />
                <SplitText
                    text="Стал ли ты сегодня миллионером или снова нет?"
                    className="text-muted-foreground text-center text-base font-medium italic sm:text-lg"
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
