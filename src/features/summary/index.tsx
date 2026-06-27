/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client'

import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetSummary, SummaryGroupBy } from '@/entities/summary/api/use-get-summary'
import { useAvailableTickers } from '@/entities/ticker-results/api/use-get-tickers'
import { TickerModels, TickerTimeFrame } from '@/entities/ticker-results/model/ticker'
import { PLACEHOLDER_QUERY } from '@/shared/types'
import { cn } from '@/shared/utils'
import { Check, ChevronDownIcon, ChevronsUpDown, Trash } from 'lucide-react'
import { useState } from 'react'
import dayjs from 'dayjs'

export const SummaryModule = () => {
    const [groupBy, setGroupBy] = useState<SummaryGroupBy[]>([])
    const [valueTicker, setValueTicker] = useState('')
    const [model, setModel] = useState<TickerModels | undefined>(undefined)
    const [timeframe, setTimeframe] = useState<TickerTimeFrame | undefined>(undefined)

    const [open, setOpen] = useState(false)
    const [openDateMin, setOpenDateMin] = useState(false)
    const [dateMin, setDateMin] = useState<Date | undefined>(undefined)
    const [openDateMax, setOpenDateMax] = useState(false)
    const [dateMax, setDateMax] = useState<Date | undefined>(undefined)

    const { data: summaryData, isLoading } = useGetSummary({
        ...PLACEHOLDER_QUERY,
        filters: {
            tickersId: valueTicker ? Number(valueTicker) : undefined,
            model: model,
            timeframe: timeframe,
            closedAt: {
                min: dateMin ? dayjs(dateMin)?.startOf('day')?.toISOString() : undefined,
                max: dateMax ? dayjs(dateMax)?.endOf('day')?.toISOString() : undefined
            }
        },
        groupBy: groupBy
    })

    const { data: tickers } = useAvailableTickers()

    if (isLoading) return <Loader />

    const formatNumber = (num: number | null | undefined) => {
        if (num === null || num === undefined) return '-'
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num)
    }

    const formatCurrency = (num: number | null | undefined) => {
        if (num === null || num === undefined) return '-'
        return `$${formatNumber(num)}`
    }

    const formatPercentage = (num: number | null | undefined) => {
        if (num === null || num === undefined) return '-'
        return `${num > 0 ? '+' : ''}${formatNumber(num)}%`
    }

    const getTimeframeLabel = (timeframe: TickerTimeFrame) => {
        switch (timeframe) {
            case TickerTimeFrame.OneDay:
                return '1 день'
            case TickerTimeFrame.OneWeek:
                return '1 неделя'
            default:
                return timeframe
        }
    }

    const toggleGroupBy = (field: SummaryGroupBy) => {
        setGroupBy((prev) => (prev.includes(field) ? prev.filter((item) => item !== field) : [...prev, field]))
    }

    const getGroupLabel = (field: SummaryGroupBy) => {
        switch (field) {
            case 'tickersId':
                return 'Тикер'
            case 'model':
                return 'Модель'
            case 'timeframe':
                return 'Таймфрейм'
            default:
                return field
        }
    }

    const overallStats =
        summaryData?.data && summaryData.data.length > 0 && groupBy.length === 0 ? summaryData.data[0] : null

    const groupedStats = summaryData?.data && groupBy.length > 0 ? summaryData.data : null

    return (
        <div className="flex flex-col gap-4">
            <div className="border-primary/50 bg-background/50 flex w-full flex-row flex-wrap items-start justify-between gap-4 rounded-lg border p-4 backdrop-blur">
                <div className="flex flex-1 flex-row flex-wrap gap-4">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="ticker-picker" className="px-1">
                            Тикер
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-[200px] justify-between"
                                    id="ticker-picker"
                                >
                                    {valueTicker
                                        ? tickers?.data.find((ticker) => ticker.id.toString() === valueTicker)?.name
                                        : 'Все тикеры'}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
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
                                                        'ml-auto',
                                                        valueTicker === '' ? 'opacity-100' : 'opacity-0'
                                                    )}
                                                />
                                            </CommandItem>
                                            {tickers?.data.map((ticker) => (
                                                <CommandItem
                                                    key={ticker.id.toString()}
                                                    value={ticker.id.toString()}
                                                    onSelect={(currentValue) => {
                                                        setValueTicker(currentValue === valueTicker ? '' : currentValue)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    {ticker.name}
                                                    <Check
                                                        className={cn(
                                                            'ml-auto',
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
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="date-min-picker" className="px-1">
                            Начало периода
                        </Label>
                        <Popover open={openDateMin} onOpenChange={setOpenDateMin}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="date-min-picker"
                                    className="w-32 justify-between font-normal"
                                >
                                    {dateMin ? dateMin.toLocaleDateString() : 'Дата'}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dateMin}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        setDateMin(date)
                                        setOpenDateMin(false)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="date-max-picker" className="px-1">
                            Конец периода
                        </Label>
                        <Popover open={openDateMax} onOpenChange={setOpenDateMax}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="date-max-picker"
                                    className="w-32 justify-between font-normal"
                                >
                                    {dateMax ? dateMax.toLocaleDateString() : 'Дата'}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dateMax}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        setDateMax(date)
                                        setOpenDateMax(false)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label className="px-1">Модель</Label>
                        <Select value={model} onValueChange={(e) => setModel(e as TickerModels)}>
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Все модели" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={TickerModels.DEEPSEEKR1T}>DEEPSEEKR1T</SelectItem>
                                <SelectItem value={TickerModels.GPT5}>GPT5</SelectItem>
                                <SelectItem value={TickerModels.QWEN3}>Llama4</SelectItem>
                            </SelectContent>
                        </Select>
                        {model && (
                            <Button variant={'outline'} onClick={() => setModel(undefined)}>
                                Сбросить
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label className="px-1">Таймфрейм</Label>
                        <Select value={timeframe} onValueChange={(e) => setTimeframe(e as TickerTimeFrame)}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Все ТФ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={TickerTimeFrame.OneDay}>1 день</SelectItem>
                                <SelectItem value={TickerTimeFrame.OneWeek}>1 неделя</SelectItem>
                            </SelectContent>
                        </Select>
                        {timeframe && (
                            <Button variant={'outline'} onClick={() => setTimeframe(undefined)}>
                                Сбросить
                            </Button>
                        )}
                    </div>
                </div>

                {/* Группировка */}
                <div className="flex flex-col gap-3">
                    <Label className="px-1">Группировка</Label>
                    <div className="flex flex-wrap gap-2">
                        {(['tickersId', 'model', 'timeframe'] as SummaryGroupBy[]).map((field) => (
                            <Button
                                key={field}
                                variant={groupBy.includes(field) ? 'default' : 'outline'}
                                onClick={() => toggleGroupBy(field)}
                                className={cn(
                                    'transition-all',
                                    groupBy.includes(field) && 'bg-blue-600 hover:bg-blue-700'
                                )}
                            >
                                {getGroupLabel(field)}
                                {groupBy.includes(field) && (
                                    <Trash
                                        className="ml-2 h-3 w-3"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            toggleGroupBy(field)
                                        }}
                                    />
                                )}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {overallStats && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                    <div className="bg-background/50 border-primary/50 rounded-lg border p-4">
                        <div className="text-muted-foreground text-sm">Всего сделок</div>
                        <div className="text-2xl font-bold">{summaryData?.data.length || 0}</div>
                    </div>
                    <div className="bg-background/50 border-primary/50 rounded-lg border p-4">
                        <div className="text-muted-foreground text-sm">Средний PNL</div>
                        <div
                            className={cn(
                                'text-2xl font-bold',
                                (overallStats.data.avg.pnl || 0) > 0 ? 'text-green-400' : 'text-red-400'
                            )}
                        >
                            {formatPercentage(overallStats.data.avg.pnl)}
                        </div>
                    </div>
                    <div className="bg-background/50 border-primary/50 rounded-lg border p-4">
                        <div className="text-muted-foreground text-sm">Средний нереал. PNL</div>
                        <div
                            className={cn(
                                'text-2xl font-bold',
                                (overallStats.data.avg.unrealizedPnl || 0) > 0 ? 'text-green-400' : 'text-red-400'
                            )}
                        >
                            {formatPercentage(overallStats.data.avg.unrealizedPnl)}
                        </div>
                    </div>
                    <div className="bg-background/50 border-primary/50 rounded-lg border p-4">
                        <div className="text-muted-foreground text-sm">Общая разница</div>
                        <div
                            className={cn(
                                'text-2xl font-bold',
                                (overallStats.data.sum.difference || 0) > 0 ? 'text-green-400' : 'text-red-400'
                            )}
                        >
                            {formatCurrency(overallStats.data.sum.difference)}
                        </div>
                    </div>
                    <div className="bg-background/50 border-primary/50 rounded-lg border p-4">
                        <div className="text-muted-foreground text-sm">Нереал. разница</div>
                        <div
                            className={cn(
                                'text-2xl font-bold',
                                (overallStats.data.sum.unrealizedDifference || 0) > 0
                                    ? 'text-green-400'
                                    : 'text-red-400'
                            )}
                        >
                            {formatCurrency(overallStats.data.sum.unrealizedDifference)}
                        </div>
                    </div>
                    <div className="bg-background/50 border-primary/50 rounded-lg border p-4">
                        <div className="text-muted-foreground text-sm">Среднее плечо</div>
                        <div className="text-2xl font-bold">{formatNumber(overallStats.data.avg.leverage)}x</div>
                    </div>
                </div>
            )}

            {groupedStats && groupedStats.length > 0 && (
                <div className="border-primary/50 bg-background/50 rounded-lg border p-4">
                    <h3 className="mb-4 text-lg font-semibold">Детальная статистика по группам</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {groupedStats.map((item, index) => (
                            <div key={index} className="bg-background border-primary/30 rounded-lg border p-4">
                                <div className="mb-3 border-b border-gray-700 pb-2">
                                    {item.groupBy.ticker && (
                                        <div className="font-semibold text-white">{item.groupBy.ticker.name}</div>
                                    )}
                                    {item.groupBy.model && (
                                        <div className="text-muted-foreground text-sm">
                                            Модель: {item.groupBy.model}
                                        </div>
                                    )}
                                    {item.groupBy.timeframe && (
                                        <div className="text-muted-foreground text-sm">
                                            Таймфрейм: {getTimeframeLabel(item.groupBy.timeframe)}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>Сделок:</div>
                                    <div className="font-medium">{item.data.count}</div>

                                    <div>Ср. PNL:</div>
                                    <div
                                        className={cn(
                                            'font-medium',
                                            (item.data.avg.pnl || 0) > 0 ? 'text-green-400' : 'text-red-400'
                                        )}
                                    >
                                        {formatPercentage(item.data.avg.pnl)}
                                    </div>

                                    <div>Ср. нереал. PNL:</div>
                                    <div
                                        className={cn(
                                            'font-medium',
                                            (item.data.avg.unrealizedPnl || 0) > 0 ? 'text-green-400' : 'text-red-400'
                                        )}
                                    >
                                        {formatPercentage(item.data.avg.unrealizedPnl)}
                                    </div>

                                    <div>Общая разница:</div>
                                    <div
                                        className={cn(
                                            'font-medium',
                                            (item.data.sum.difference || 0) > 0 ? 'text-green-400' : 'text-red-400'
                                        )}
                                    >
                                        {formatCurrency(item.data.sum.difference)}
                                    </div>

                                    <div>Нереал. разница:</div>
                                    <div
                                        className={cn(
                                            'font-medium',
                                            (item.data.sum.unrealizedDifference || 0) > 0
                                                ? 'text-green-400'
                                                : 'text-red-400'
                                        )}
                                    >
                                        {formatCurrency(item.data.sum.unrealizedDifference)}
                                    </div>

                                    <div>Ср. плечо:</div>
                                    <div className="font-medium">{formatNumber(item.data.avg.leverage)}x</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {(!summaryData?.data || summaryData.data.length === 0) && (
                <div className="border-primary/50 bg-background/50 flex items-center justify-center rounded-lg border p-8">
                    <p className="text-muted-foreground text-lg">Нет данных для отображения</p>
                </div>
            )}
        </div>
    )
}
