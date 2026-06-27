'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TickerUsage } from '@/entities/ticker-results/model/ticker'
import { DATE_TIME_DEFAULT_FORMAT } from '@/shared/config'
import { cn } from '@/shared/utils'
import dayjs from 'dayjs'
import { Coins } from 'lucide-react'
import { formatTokens } from '../lib/format'
import { MODEL_LABELS } from '../lib/labels'

interface TickerUsageDialogProps {
    usage: TickerUsage
    tickerName: string
}

export const TickerUsageDialog = ({ usage, tickerName }: TickerUsageDialogProps) => {
    const totalTokens = usage.prompt + usage.response

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground h-7 gap-1.5 px-2 text-xs"
                    title="Потраченные токены"
                >
                    <Coins className="size-3.5 text-amber-400" />
                    {formatTokens(totalTokens)}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Расход токенов</DialogTitle>
                    <DialogDescription>
                        {tickerName} · {MODEL_LABELS[usage.model] ?? usage.model}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                    <div className="grid grid-cols-3 gap-2">
                        <UsageStat label="Prompt" value={formatTokens(usage.prompt)} tone="blue" />
                        <UsageStat label="Response" value={formatTokens(usage.response)} tone="violet" />
                        <UsageStat label="Всего" value={formatTokens(totalTokens)} tone="amber" highlight />
                    </div>
                    <p className="text-muted-foreground text-xs">
                        {dayjs(usage.createdAt).format(DATE_TIME_DEFAULT_FORMAT)}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const UsageStat = ({
    label,
    value,
    tone,
    highlight
}: {
    label: string
    value: string
    tone: 'blue' | 'violet' | 'amber'
    highlight?: boolean
}) => {
    const toneClasses = {
        blue: 'border-blue-500/20 bg-blue-500/5 text-blue-300',
        violet: 'border-violet-500/20 bg-violet-500/5 text-violet-300',
        amber: 'border-amber-500/20 bg-amber-500/5 text-amber-300'
    }

    return (
        <div
            className={cn(
                'flex flex-col gap-1 rounded-lg border px-3 py-2.5',
                toneClasses[tone],
                highlight && 'ring-amber-500/30 ring-1'
            )}
        >
            <span className="text-muted-foreground text-[10px] uppercase tracking-wide">{label}</span>
            <span className="text-base font-semibold tabular-nums">{value}</span>
        </div>
    )
}
