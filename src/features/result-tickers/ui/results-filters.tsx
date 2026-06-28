/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilterField, FilterGroupTitle, GlassPanel } from '@/components/page-layout'
import { Ticker, TickerModels } from '@/entities/ticker-results/model/ticker'
import { SortOptions } from '@/shared/types'
import { cn } from '@/shared/utils'
import {
    ArrowDownUp,
    CalendarDays,
    Check,
    ChevronDownIcon,
    ChevronsUpDown,
    Filter,
    RotateCcw,
    SortAsc,
    SortDesc,
    X
} from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

interface ResultsFiltersProps {
    tickers?: Ticker[]
    valueTicker: string
    setValueTicker: (value: string) => void
    open: boolean
    setOpen: (value: boolean) => void
    createdDateMin?: Date
    setCreatedDateMin: (value?: Date) => void
    openCreatedDateMin: boolean
    setOpenCreatedDateMin: (value: boolean) => void
    createdDateMax?: Date
    setCreatedDateMax: (value?: Date) => void
    openCreatedDateMax: boolean
    setOpenCreatedDateMax: (value: boolean) => void
    dateMin?: Date
    setDateMin: (value?: Date) => void
    openDate: boolean
    setOpenDate: (value: boolean) => void
    dateMax?: Date
    setDateMax: (value?: Date) => void
    openDateMax: boolean
    setOpenDateMax: (value: boolean) => void
    model?: TickerModels
    setModel: (value?: TickerModels) => void
    isClosed?: string
    setIsClosed: (value?: string) => void
    sortCreated?: SortOptions
    setSortCreated: Dispatch<SetStateAction<SortOptions | undefined>>
    sortPnl?: SortOptions
    setSortPnl: Dispatch<SetStateAction<SortOptions | undefined>>
    sortUnrealizedPnl?: SortOptions
    setSortUnrealizedPnl: Dispatch<SetStateAction<SortOptions | undefined>>
    sortIsClosed?: SortOptions
    setSortIsClosed: Dispatch<SetStateAction<SortOptions | undefined>>
    sortClosedAt?: SortOptions
    setSortClosedAt: Dispatch<SetStateAction<SortOptions | undefined>>
    onReset: () => void
}

const DatePickerButton = ({
    id,
    date,
    placeholder = 'Выберите'
}: {
    id: string
    date?: Date
    placeholder?: string
}) => (
    <Button variant="outline" id={id} className="w-full justify-between font-normal">
        <span className={cn(!date && 'text-muted-foreground')}>
            {date ? date.toLocaleDateString('ru-RU') : placeholder}
        </span>
        <ChevronDownIcon className="size-4 opacity-60" />
    </Button>
)

const SortChip = ({
    label,
    sort,
    onToggle,
    onClear
}: {
    label: string
    sort?: SortOptions
    onToggle: () => void
    onClear: () => void
}) => (
    <div
        className={cn(
            'flex items-center gap-1 rounded-full border px-2.5 py-1 transition-colors',
            sort ? 'border-primary/40 bg-primary/10' : 'border-gray-700/50 bg-gray-900/30'
        )}
    >
        <span className="text-muted-foreground text-xs">{label}</span>
        <button type="button" onClick={onToggle} className="text-foreground hover:text-primary transition-colors">
            {sort === 'ASC' ? <SortDesc className="size-3.5" /> : <SortAsc className="size-3.5" />}
        </button>
        {sort && (
            <button type="button" onClick={onClear} className="text-muted-foreground hover:text-destructive transition-colors">
                <X className="size-3" />
            </button>
        )}
    </div>
)

export const ResultsFilters = ({
    tickers,
    valueTicker,
    setValueTicker,
    open,
    setOpen,
    createdDateMin,
    setCreatedDateMin,
    openCreatedDateMin,
    setOpenCreatedDateMin,
    createdDateMax,
    setCreatedDateMax,
    openCreatedDateMax,
    setOpenCreatedDateMax,
    dateMin,
    setDateMin,
    openDate,
    setOpenDate,
    dateMax,
    setDateMax,
    openDateMax,
    setOpenDateMax,
    model,
    setModel,
    isClosed,
    setIsClosed,
    sortCreated,
    setSortCreated,
    sortPnl,
    setSortPnl,
    sortUnrealizedPnl,
    setSortUnrealizedPnl,
    sortIsClosed,
    setSortIsClosed,
    sortClosedAt,
    setSortClosedAt,
    onReset
}: ResultsFiltersProps) => {
    const hasActiveFilters =
        valueTicker ||
        createdDateMin ||
        createdDateMax ||
        dateMin ||
        dateMax ||
        model ||
        isClosed !== undefined ||
        sortCreated ||
        sortPnl ||
        sortUnrealizedPnl ||
        sortIsClosed ||
        sortClosedAt

    return (
        <GlassPanel className="flex flex-col gap-5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                        <Filter className="size-4" />
                    </div>
                    <div>
                        <p className="font-medium">Фильтры и сортировка</p>
                        <p className="text-muted-foreground text-xs">Настройте выборку прогнозов</p>
                    </div>
                </div>
                {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5">
                        <RotateCcw className="size-3.5" />
                        Сбросить
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="flex flex-col gap-3">
                    <FilterGroupTitle>Основное</FilterGroupTitle>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <FilterField label="Тикер">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between"
                                    >
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
                                                            setValueTicker(
                                                                currentValue === valueTicker ? '' : currentValue
                                                            )
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
                                    <SelectItem value={TickerModels.DEEPSEEK4FLASH}>DeepSeek v4 flash</SelectItem>
                                    <SelectItem value={TickerModels.GPT5}>GPT-5</SelectItem>
                                    <SelectItem value={TickerModels.LLAMA4}>Llama 4</SelectItem>
                                </SelectContent>
                            </Select>
                        </FilterField>

                        <FilterField label="Статус">
                            <Select value={isClosed} onValueChange={setIsClosed}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Любой" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Закрыт</SelectItem>
                                    <SelectItem value="0">Активен</SelectItem>
                                </SelectContent>
                            </Select>
                        </FilterField>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <FilterGroupTitle>
                        <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="size-3.5" />
                            Дата создания
                        </span>
                    </FilterGroupTitle>
                    <div className="grid grid-cols-2 gap-3">
                        <FilterField label="От">
                            <Popover open={openCreatedDateMin} onOpenChange={setOpenCreatedDateMin}>
                                <PopoverTrigger asChild>
                                    <DatePickerButton id="created-min" date={createdDateMin} />
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={createdDateMin}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setCreatedDateMin(date)
                                            setOpenCreatedDateMin(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </FilterField>
                        <FilterField label="До">
                            <Popover open={openCreatedDateMax} onOpenChange={setOpenCreatedDateMax}>
                                <PopoverTrigger asChild>
                                    <DatePickerButton id="created-max" date={createdDateMax} />
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={createdDateMax}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setCreatedDateMax(date)
                                            setOpenCreatedDateMax(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </FilterField>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <FilterGroupTitle>
                        <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="size-3.5" />
                            Дата закрытия
                        </span>
                    </FilterGroupTitle>
                    <div className="grid grid-cols-2 gap-3">
                        <FilterField label="От">
                            <Popover open={openDate} onOpenChange={setOpenDate}>
                                <PopoverTrigger asChild>
                                    <DatePickerButton id="closed-min" date={dateMin} />
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateMin}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setDateMin(date)
                                            setOpenDate(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </FilterField>
                        <FilterField label="До">
                            <Popover open={openDateMax} onOpenChange={setOpenDateMax}>
                                <PopoverTrigger asChild>
                                    <DatePickerButton id="closed-max" date={dateMax} />
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
                        <ArrowDownUp className="size-3.5" />
                        Сортировка
                    </span>
                </FilterGroupTitle>
                <div className="flex flex-wrap gap-2">
                    <SortChip
                        label="Создание"
                        sort={sortCreated}
                        onToggle={() => setSortCreated((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
                        onClear={() => setSortCreated(undefined)}
                    />
                    <SortChip
                        label="PNL"
                        sort={sortPnl}
                        onToggle={() => setSortPnl((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
                        onClear={() => setSortPnl(undefined)}
                    />
                    <SortChip
                        label="Нереал. PNL"
                        sort={sortUnrealizedPnl}
                        onToggle={() => setSortUnrealizedPnl((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
                        onClear={() => setSortUnrealizedPnl(undefined)}
                    />
                    <SortChip
                        label="Статус"
                        sort={sortIsClosed}
                        onToggle={() => setSortIsClosed((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
                        onClear={() => setSortIsClosed(undefined)}
                    />
                    <SortChip
                        label="Закрытие"
                        sort={sortClosedAt}
                        onToggle={() => setSortClosedAt((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
                        onClear={() => setSortClosedAt(undefined)}
                    />
                </div>
            </div>
        </GlassPanel>
    )
}
