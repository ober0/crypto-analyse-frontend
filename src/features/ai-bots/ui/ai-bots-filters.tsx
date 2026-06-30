/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilterField, FilterGroupTitle, GlassPanel } from '@/components/page-layout'
import { ProcessingInterval, ProcessingStatus } from '@/entities/ai-processing/model/ai-bot'
import { TickerModels } from '@/entities/ticker-results/model/ticker'
import { Ticker } from '@/entities/ticker-results/model/ticker'
import { SortOptions } from '@/shared/types'
import { cn } from '@/shared/utils'
import { Check, ChevronsUpDown, Filter, RotateCcw } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { INTERVAL_LABELS, STATUS_LABELS } from '../lib/labels'

interface AiBotsFiltersProps {
    tickers?: Ticker[]
    valueTicker: string
    setValueTicker: (value: string) => void
    open: boolean
    setOpen: (value: boolean) => void
    model?: TickerModels
    setModel: (value?: TickerModels) => void
    status?: ProcessingStatus
    setStatus: (value?: ProcessingStatus) => void
    interval?: ProcessingInterval
    setInterval: (value?: ProcessingInterval) => void
    sortStatus?: SortOptions
    setSortStatus: Dispatch<SetStateAction<SortOptions | undefined>>
    onReset: () => void
}

export const AiBotsFilters = ({
    tickers,
    valueTicker,
    setValueTicker,
    open,
    setOpen,
    model,
    setModel,
    status,
    setStatus,
    interval,
    setInterval,
    sortStatus,
    setSortStatus,
    onReset
}: AiBotsFiltersProps) => {
    const hasActiveFilters = valueTicker || model || status || interval || sortStatus

    return (
        <GlassPanel className="flex flex-col gap-4 p-3 sm:gap-5 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                        <Filter className="size-4" />
                    </div>
                    <div>
                        <p className="font-medium">Фильтры ботов</p>
                        <p className="text-muted-foreground text-xs">Поиск и сортировка торговых ботов</p>
                    </div>
                </div>
                {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5">
                        <RotateCcw className="size-3.5" />
                        Сбросить
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <FilterField label="Тикер">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" className="w-full justify-between">
                                {valueTicker
                                    ? tickers?.find((t) => t.id.toString() === valueTicker)?.name
                                    : 'Все тикеры'}
                                <ChevronsUpDown className="size-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[220px] p-0">
                            <Command>
                                <CommandList>
                                    <CommandEmpty>Тикеры не найдены</CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            value=""
                                            onSelect={() => {
                                                setValueTicker('')
                                                setOpen(false)
                                            }}
                                        >
                                            Все тикеры
                                            <Check
                                                className={cn(
                                                    'ml-auto size-4',
                                                    valueTicker === '' ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                        {tickers?.map((ticker) => (
                                            <CommandItem
                                                key={ticker.id}
                                                value={ticker.id.toString()}
                                                onSelect={(currentValue) => {
                                                    setValueTicker(currentValue === valueTicker ? '' : currentValue)
                                                    setOpen(false)
                                                }}
                                            >
                                                {ticker.name}
                                                <Check
                                                    className={cn(
                                                        'ml-auto size-4',
                                                        valueTicker === ticker.id.toString()
                                                            ? 'opacity-100'
                                                            : 'opacity-0'
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </FilterField>

                <FilterField label="Модель">
                    <Select value={model} onValueChange={(e) => setModel(e as TickerModels)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Все модели" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={TickerModels.DEEPSEEK4FLASH}>DeepSeek 4 Flash</SelectItem>
                            <SelectItem value={TickerModels.GPT5}>GPT-5</SelectItem>
                            <SelectItem value={TickerModels.LLAMA4}>Llama 4</SelectItem>
                        </SelectContent>
                    </Select>
                </FilterField>

                <FilterField label="Статус">
                    <Select
                        value={status}
                        onValueChange={(e) => setStatus(e as ProcessingStatus)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Любой" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(ProcessingStatus).map((s) => (
                                <SelectItem key={s} value={s}>
                                    {STATUS_LABELS[s]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FilterField>

                <FilterField label="Интервал">
                    <Select
                        value={interval}
                        onValueChange={(e) => setInterval(e as ProcessingInterval)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Любой" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(ProcessingInterval).map((i) => (
                                <SelectItem key={i} value={i}>
                                    {INTERVAL_LABELS[i]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FilterField>
            </div>

            <div className="border-primary/20 flex flex-col gap-2 border-t pt-4">
                <FilterGroupTitle>Сортировка по статусу</FilterGroupTitle>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant={sortStatus ? 'default' : 'outline'}
                        onClick={() => setSortStatus((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
                    >
                        {sortStatus === 'ASC' ? 'A → Z' : sortStatus === 'DESC' ? 'Z → A' : 'По статусу'}
                    </Button>
                    {sortStatus && (
                        <Button size="sm" variant="ghost" onClick={() => setSortStatus(undefined)}>
                            Сбросить
                        </Button>
                    )}
                </div>
            </div>
        </GlassPanel>
    )
}
