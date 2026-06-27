'use client'

import { PageHeader } from '@/components/page-layout'
import { Loader } from '@/components/loader'
import { SummaryModule } from '@/features/summary'
import { useIsAuth } from '@/entities/auth/hooks/use-is-auth'
import { ROUTES } from '@/shared/router'
import { useRouter } from 'next/navigation'

export default function SummaryPage() {
    const { push } = useRouter()
    const { isAuth, isLoading } = useIsAuth()

    if (isLoading) return <Loader />

    if (!isAuth) return push(ROUTES.AUTH_PAGE)

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Отчёты" description="Сводная статистика по сделкам и прогнозам" />
            <SummaryModule />
        </div>
    )
}
