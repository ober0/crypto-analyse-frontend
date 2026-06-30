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
import { useUpdateAiBot } from '@/entities/ai-processing/api/use-ai-bots'
import { AiBot } from '@/entities/ai-processing/model/ai-bot'
import { getAxiosErrorMessage } from '@/shared/lib/get-axios-error-message'
import { Pencil } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import toast from 'react-hot-toast'

interface EditAiBotDialogProps {
    bot: Pick<AiBot, 'id' | 'checkIntervalMins' | 'customPrompt' | 'withWebSearch'>
    trigger?: ReactNode
}

export const EditAiBotDialog = ({ bot, trigger }: EditAiBotDialogProps) => {
    const [open, setOpen] = useState(false)
    const [checkIntervalMins, setCheckIntervalMins] = useState(String(bot.checkIntervalMins))
    const [customPrompt, setCustomPrompt] = useState(bot.customPrompt ?? '')
    const [withWebSearch, setWithWebSearch] = useState(bot.withWebSearch ? 'true' : 'false')

    const { mutate, isPending } = useUpdateAiBot()

    const handleOpenChange = (nextOpen: boolean) => {
        if (nextOpen) {
            setCheckIntervalMins(String(bot.checkIntervalMins))
            setCustomPrompt(bot.customPrompt ?? '')
            setWithWebSearch(bot.withWebSearch ? 'true' : 'false')
        }

        setOpen(nextOpen)
    }

    const handleSave = () => {
        const mins = Number(checkIntervalMins)
        if (!mins || mins < 5 || mins > 1440) {
            toast.error('Интервал проверки: от 5 до 1440 минут')
            return
        }

        mutate(
            {
                id: bot.id,
                data: {
                    checkIntervalMins: mins,
                    customPrompt: customPrompt.trim() || undefined,
                    withWebSearch: withWebSearch === 'true'
                }
            },
            {
                onSuccess: () => {
                    toast.success('Бот обновлён')
                    setOpen(false)
                },
                onError: (error) => {
                    toast.error(getAxiosErrorMessage(error, 'Не удалось обновить бота'))
                }
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <Pencil className="size-3.5" />
                        Изменить
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Настройки бота</DialogTitle>
                    <DialogDescription>Измените интервал проверки, промпт и веб-поиск</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
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
                    <Button onClick={handleSave} loading={isPending}>
                        Сохранить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
