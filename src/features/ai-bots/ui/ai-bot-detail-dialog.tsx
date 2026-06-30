/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client'

import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { useGetAiBot } from '@/entities/ai-processing/api/use-ai-bots'
import { cn } from '@/shared/utils'
import { FileText, ListOrdered, ScrollText } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { formatBotModel } from '../lib/labels'
import { AiBotInfoTab } from './ai-bot-info-tab'
import { AiBotLogsTab } from './ai-bot-logs-tab'
import { AiBotTradesTab } from './ai-bot-trades-tab'

type DetailTab = 'trades' | 'logs' | 'info'

const TABS: { id: DetailTab; label: string; icon: typeof ListOrdered }[] = [
    { id: 'trades', label: 'Сделки', icon: ListOrdered },
    { id: 'logs', label: 'Логи', icon: ScrollText },
    { id: 'info', label: 'Инфо', icon: FileText }
]

interface AiBotDetailDialogProps {
    botId: number
    trigger: ReactNode
}

export const AiBotDetailDialog = ({ botId, trigger }: AiBotDetailDialogProps) => {
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState<DetailTab>('trades')
    const [selectedTradeId, setSelectedTradeId] = useState<number | null>(null)
    const { data, isLoading } = useGetAiBot(open ? botId : null)

    const bot = data?.data

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (!nextOpen) {
            setTab('trades')
            setSelectedTradeId(null)
        }
    }

    const handleTabChange = (nextTab: DetailTab) => {
        setTab(nextTab)
        if (nextTab !== 'trades') {
            setSelectedTradeId(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
                <DialogHeader className="shrink-0 border-b border-white/10 px-4 py-4 sm:px-6">
                    <DialogTitle>
                        {bot ? `${bot.ticker.name} · ${formatBotModel(bot.model)}` : 'Детали бота'}
                    </DialogTitle>
                    <DialogDescription>Торговые сделки, логи и параметры бота</DialogDescription>
                </DialogHeader>

                {isLoading && (
                    <div className="flex flex-1 items-center justify-center py-16">
                        <Loader />
                    </div>
                )}

                {!isLoading && bot && (
                    <div className="flex min-h-0 flex-1 flex-col">
                        <div className="shrink-0 border-b border-white/10 px-4 py-3 sm:px-6">
                            <div className="flex flex-wrap gap-1">
                                {TABS.map(({ id, label, icon: Icon }) => (
                                    <Button
                                        key={id}
                                        variant={tab === id ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => handleTabChange(id)}
                                        className={cn(
                                            'gap-1.5 rounded-lg',
                                            tab !== id && 'text-muted-foreground'
                                        )}
                                    >
                                        <Icon className="size-4" />
                                        {label}
                                        {id === 'trades' && (
                                            <span className="text-muted-foreground tabular-nums">
                                                ({bot.trades.length})
                                            </span>
                                        )}
                                        {id === 'logs' && (
                                            <span className="text-muted-foreground tabular-nums">
                                                ({bot.logs.length})
                                            </span>
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                            {tab === 'trades' && (
                                <AiBotTradesTab
                                    trades={bot.trades}
                                    selectedTradeId={selectedTradeId}
                                    onSelectTrade={setSelectedTradeId}
                                />
                            )}
                            {tab === 'logs' && <AiBotLogsTab logs={bot.logs} />}
                            {tab === 'info' && <AiBotInfoTab bot={bot} />}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
