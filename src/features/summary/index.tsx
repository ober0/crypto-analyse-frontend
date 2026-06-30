/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client'

import { FilterField, FilterGroupTitle, GlassPanel } from '@/components/page-layout'
import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetSummary, SummaryGroupBy } from '@/entities/summary/api/use-get-summary'
import { useAvailableTickers } from '@/entities/ticker-results/api/use-get-tickers'
import { TickerModels, TickerTimeFrame } from '@/entities/ticker-results/model/ticker'
import { PLACEHOLDER_QUERY } from '@/shared/types'
import { cn } from '@/shared/utils'
import { Check, ChevronDownIcon, ChevronsUpDown, Filter, Layers, RotateCcw } from 'lucide-react'
import { useCallback, useState } from 'react'
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

    const handleReset = useCallback(() => {
        setValueTicker('')
        setModel(undefined)
        setTimeframe(undefined)
        setDateMin(undefined)
        setDateMax(undefined)
        setGroupBy([])
    }, [])

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

    const getTimeframeLabel = (tf: TickerTimeFrame) => {
        switch (tf) {
            case TickerTimeFrame.OneDay:
                return '1 день'
            case TickerTimeFrame.OneWeek:
                return '1 неделя'
            default:
                return tf
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

    const hasActiveFilters = valueTicker || model || timeframe || dateMin || dateMax || groupBy.length > 0

    return (
        <div className="flex flex-col gap-4">
            <GlassPanel className="flex flex-col gap-4 p-3 sm:gap-5 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                            <Filter className="size-4" />
                        </div>
                        <div>
                            <p className="font-medium">Параметры отчёта</p>
                            <p className="text-muted-foreground text-xs">Фильтры и группировка данных</p>
                        </div>
                    </div>
                    {hasActiveFilters && (
                        <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
                            <RotateCcw className="size-3.5" />
                            Сбросить
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <FilterField label="Тикер">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                                        {valueTicker
                                            ? tickers?.data.find((ticker) => ticker.id.toString() === valueTicker)?.name
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
                                                    <Check className={cn('ml-auto size-4', valueTicker === '' ? 'opacity-100' : 'opacity-0')} />
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
                                                                'ml-auto size-4',
                                                                valueTicker === ticker.id.toString() ? 'opacity-100' : 'opacity-0'
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
                                    <SelectItem value={TickerModels.DEEPSEEK4FLASH}>DeepSeek v4 flash</SelectItem>
                                    <SelectItem value={TickerModels.GPT5}>GPT-5</SelectItem>
                                    <SelectItem value={TickerModels.LLAMA4}>Llama 4</SelectItem>
                                </SelectContent>
                            </Select>
                        </FilterField>

                        <FilterField label="Таймфрейм">
                            <Select value={timeframe} onValueChange={(e) => setTimeframe(e as TickerTimeFrame)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Все ТФ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={TickerTimeFrame.OneDay}>1 день</SelectItem>
                                    <SelectItem value={TickerTimeFrame.OneWeek}>1 неделя</SelectItem>
                                </SelectContent>
                            </Select>
                        </FilterField>
                    </div>

                    <div className="flex flex-col gap-3">
                        <FilterGroupTitle>Период закрытия</FilterGroupTitle>
                        <div className="grid grid-cols-2 gap-3">
                            <FilterField label="От">
                                <Popover open={openDateMin} onOpenChange={setOpenDateMin}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between font-normal">
                                            <span className={cn(!dateMin && 'text-muted-foreground')}>
                                                {dateMin ? dateMin.toLocaleDateString('ru-RU') : 'Дата'}
                                            </span>
                                            <ChevronDownIcon className="size-4 opacity-60" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
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
                            </FilterField>
                            <FilterField label="До">
                                <Popover open={openDateMax} onOpenChange={setOpenDateMax}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between font-normal">
                                            <span className={cn(!dateMax && 'text-muted-foreground')}>
                                                {dateMax ? dateMax.toLocaleDateString('ru-RU') : 'Дата'}
                                            </span>
                                            <ChevronDownIcon className="size-4 opacity-60" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
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
                            </FilterField>
                        </div>
                    </div>
                </div>

                <div className="border-primary/20 flex flex-col gap-2 border-t pt-4">
                    <FilterGroupTitle>
                        <span className="inline-flex items-center gap-1.5">
                            <Layers className="size-3.5" />
                            Группировка
                        </span>
                    </FilterGroupTitle>
                    <div className="flex flex-wrap gap-2">
                        {(['tickersId', 'model', 'timeframe'] as SummaryGroupBy[]).map((field) => (
                            <Button
                                key={field}
                                size="sm"
                                variant={groupBy.includes(field) ? 'default' : 'outline'}
                                onClick={() => toggleGroupBy(field)}
                                className="rounded-full"
                            >
                                {getGroupLabel(field)}
                            </Button>
                        ))}
                    </div>
                </div>
            </GlassPanel>

            {overallStats && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <StatCard label="Всего сделок" value={String(summaryData?.data.length || 0)} />
                    <StatCard
                        label="Средний PNL"
                        value={formatPercentage(overallStats.data.avg.pnl)}
                        tone={(overallStats.data.avg.pnl || 0) >= 0 ? 'positive' : 'negative'}
                    />
                    <StatCard
                        label="Средний нереал. PNL"
                        value={formatPercentage(overallStats.data.avg.unrealizedPnl)}
                        tone={(overallStats.data.avg.unrealizedPnl || 0) >= 0 ? 'positive' : 'negative'}
                    />
                    <StatCard
                        label="Общая разница"
                        value={formatCurrency(overallStats.data.sum.difference)}
                        tone={(overallStats.data.sum.difference || 0) >= 0 ? 'positive' : 'negative'}
                    />
                    <StatCard
                        label="Нереал. разница"
                        value={formatCurrency(overallStats.data.sum.unrealizedDifference)}
                        tone={(overallStats.data.sum.unrealizedDifference || 0) >= 0 ? 'positive' : 'negative'}
                    />
                    <StatCard label="Среднее плечо" value={`${formatNumber(overallStats.data.avg.leverage)}x`} />
                </div>
            )}

            {groupedStats && groupedStats.length > 0 && (
                <GlassPanel className="p-3 sm:p-5">
                    <h3 className="mb-4 text-base font-semibold">Детальная статистика по группам</h3>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {groupedStats.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-gray-700/50 bg-gray-900/30 p-4 transition-colors hover:border-primary/30"
                            >
                                <div className="mb-3 flex flex-col gap-0.5 border-b border-gray-700/60 pb-3">
                                    {item.groupBy.ticker && (
                                        <div className="font-semibold text-white">{item.groupBy.ticker.name}</div>
                                    )}
                                    {item.groupBy.model && (
                                        <div className="text-muted-foreground text-sm">Модель: {item.groupBy.model}</div>
                                    )}
                                    {item.groupBy.timeframe && (
                                        <div className="text-muted-foreground text-sm">
                                            Таймфрейм: {getTimeframeLabel(item.groupBy.timeframe)}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                                    <span className="text-muted-foreground">Сделок</span>
                                    <span className="text-right font-medium tabular-nums">{item.data.count}</span>

                                    <span className="text-muted-foreground">Ср. PNL</span>
                                    <span
                                        className={cn(
                                            'text-right font-medium tabular-nums',
                                            (item.data.avg.pnl || 0) > 0 ? 'text-green-400' : 'text-red-400'
                                        )}
                                    >
                                        {formatPercentage(item.data.avg.pnl)}
                                    </span>

                                    <span className="text-muted-foreground">Ср. нереал. PNL</span>
                                    <span
                                        className={cn(
                                            'text-right font-medium tabular-nums',
                                            (item.data.avg.unrealizedPnl || 0) > 0 ? 'text-green-400' : 'text-red-400'
                                        )}
                                    >
                                        {formatPercentage(item.data.avg.unrealizedPnl)}
                                    </span>

                                    <span className="text-muted-foreground">Общая разница</span>
                                    <span
                                        className={cn(
                                            'text-right font-medium tabular-nums',
                                            (item.data.sum.difference || 0) > 0 ? 'text-green-400' : 'text-red-400'
                                        )}
                                    >
                                        {formatCurrency(item.data.sum.difference)}
                                    </span>

                                    <span className="text-muted-foreground">Нереал. разница</span>
                                    <span
                                        className={cn(
                                            'text-right font-medium tabular-nums',
                                            (item.data.sum.unrealizedDifference || 0) > 0
                                                ? 'text-green-400'
                                                : 'text-red-400'
                                        )}
                                    >
                                        {formatCurrency(item.data.sum.unrealizedDifference)}
                                    </span>

                                    <span className="text-muted-foreground">Ср. плечо</span>
                                    <span className="text-right font-medium tabular-nums">
                                        {formatNumber(item.data.avg.leverage)}x
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassPanel>
            )}

            {(!summaryData?.data || summaryData.data.length === 0) && (
                <GlassPanel className="flex items-center justify-center p-10">
                    <p className="text-muted-foreground">Нет данных для отображения</p>
                </GlassPanel>
            )}
        </div>
    )
}

const StatCard = ({
    label,
    value,
    tone
}: {
    label: string
    value: string
    tone?: 'positive' | 'negative'
}) => (
    <div className="border-primary/50 bg-background/50 flex flex-col gap-1 rounded-xl border px-4 py-3 backdrop-blur">
        <span className="text-muted-foreground text-xs uppercase tracking-wide">{label}</span>
        <span
            className={cn(
                'text-2xl font-bold tabular-nums',
                tone === 'positive' && 'text-green-400',
                tone === 'negative' && 'text-red-400'
            )}
        >
            {value}
        </span>
    </div>
)
