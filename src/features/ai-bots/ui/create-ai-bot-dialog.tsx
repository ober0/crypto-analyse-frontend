/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateAiBot } from '@/entities/ai-processing/api/use-ai-bots'
import { ProcessingInterval } from '@/entities/ai-processing/model/ai-bot'
import { useAvailableTickers } from '@/entities/ticker-results/api/use-get-tickers'
import { TickerModels } from '@/entities/ticker-results/model/ticker'
import { INTERVAL_LABELS } from '@/features/ai-bots/lib/labels'
import { formatModelLabel } from '@/shared/lib/format-model-label'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

export const CreateAiBotDialog = () => {
    const [open, setOpen] = useState(false)
    const [tickersId, setTickersId] = useState('')
    const [model, setModel] = useState<TickerModels>(TickerModels.GPT5)
    const [checkIntervalMins, setCheckIntervalMins] = useState('15')
    const [interval, setInterval] = useState<ProcessingInterval>(ProcessingInterval.OneDay)
    const [customPrompt, setCustomPrompt] = useState('')
    const [withWebSearch, setWithWebSearch] = useState('true')

    const { data: tickers } = useAvailableTickers()
    const { mutate, isPending } = useCreateAiBot()

    const reset = () => {
        setTickersId('')
        setModel(TickerModels.GPT5)
        setCheckIntervalMins('15')
        setInterval(ProcessingInterval.OneDay)
        setCustomPrompt('')
        setWithWebSearch('true')
    }

    const handleCreate = () => {
        if (!tickersId) {
            toast.error('Выберите тикер')
            return
        }

        const mins = Number(checkIntervalMins)
        if (!mins || mins < 5 || mins > 1440) {
            toast.error('Интервал проверки: от 5 до 1440 минут')
            return
        }

        mutate(
            {
                tickersId: Number(tickersId),
                model,
                checkIntervalMins: mins,
                interval,
                customPrompt: customPrompt.trim() || undefined,
                withWebSearch: withWebSearch === 'true'
            },
            {
                onSuccess: () => {
                    toast.success('Бот создан')
                    setOpen(false)
                    reset()
                },
                onError: (error: AxiosError<{ message?: string }>) => {
                    toast.error(error.response?.data?.message || 'Не удалось создать бота')
                }
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-1.5">
                    <Plus className="size-4" />
                    Создать бота
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Новый торговый бот</DialogTitle>
                    <DialogDescription>Настройте параметры AI-бота для автоматической торговли</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Тикер</Label>
                        <Select value={tickersId} onValueChange={setTickersId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите тикер" />
                            </SelectTrigger>
                            <SelectContent>
                                {tickers?.data.map((ticker) => (
                                    <SelectItem key={ticker.id} value={ticker.id.toString()}>
                                        {ticker.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Модель</Label>
                            <Select value={model} onValueChange={(e) => setModel(e as TickerModels)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(TickerModels).map((m) => (
                                        <SelectItem key={m} value={m}>
                                            {formatModelLabel(m)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Интервал работы</Label>
                            <Select value={interval} onValueChange={(e) => setInterval(e as ProcessingInterval)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(ProcessingInterval).map((i) => (
                                        <SelectItem key={i} value={i}>
                                            {INTERVAL_LABELS[i]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Проверка каждые (мин)</Label>
                            <Input
                                type="number"
                                min={5}
                                max={1440}
                                value={checkIntervalMins}
                                onChange={(e) => setCheckIntervalMins(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Веб-поиск</Label>
                            <Select value={withWebSearch} onValueChange={setWithWebSearch}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Включён</SelectItem>
                                    <SelectItem value="false">Выключен</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Кастомный промпт (опционально)</Label>
                        <textarea
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="Дополнительные инструкции для модели..."
                            className="border-input bg-background/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Отмена
                    </Button>
                    <Button onClick={handleCreate} loading={isPending}>
                        Создать
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
