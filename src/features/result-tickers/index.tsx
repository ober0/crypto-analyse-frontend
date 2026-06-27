/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client'

import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useResultsTickers } from '@/entities/ticker-results/api/use-get-processed-tickers'
import { useAvailableTickers } from '@/entities/ticker-results/api/use-get-tickers'
import { TickerDirection, TickerModels, TickerTimeFrame } from '@/entities/ticker-results/model/ticker'
import { PLACEHOLDER_QUERY, SortOptions } from '@/shared/types'
import { cn } from '@/shared/utils'
import { Check, ChevronDownIcon, ChevronsUpDown, SortAsc, SortDesc, Trash } from 'lucide-react'
import { useState } from 'react'
import dayjs from 'dayjs'
import { DATE_TIME_DEFAULT_FORMAT } from '@/shared/config'
import { Pagination } from '@/components/pagination'

export const ResultsTickersList = () => {
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(10)

    const [isClosed, setIsClosed] = useState<string | undefined>(undefined)
    const [open, setOpen] = useState(false)
    const [valueTicker, setValueTicker] = useState('')

    const [openDate, setOpenDate] = useState(false)
    const [dateMin, setDateMin] = useState<Date | undefined>(undefined)
    const [openDateMax, setOpenDateMax] = useState(false)
    const [dateMax, setDateMax] = useState<Date | undefined>(undefined)

    const [openCreatedDateMin, setOpenCreatedDateMin] = useState(false)
    const [createdDateMin, setCreatedDateMin] = useState<Date | undefined>(undefined)
    const [openCreatedDateMax, setOpenCreatedDateMax] = useState(false)
    const [createdDateMax, setCreatedDateMax] = useState<Date | undefined>(undefined)

    const [model, setModel] = useState<TickerModels | undefined>(undefined)

    const [sortCreated, setSortCreated] = useState<SortOptions | undefined>(undefined)
    const [sortPnl, setSortPnl] = useState<SortOptions | undefined>(undefined)
    const [sortUnrealizedPnl, setSortUnrealizedPnl] = useState<SortOptions | undefined>(undefined)
    const [sortIsClosed, setSortIsClosed] = useState<SortOptions | undefined>(undefined)
    const [sortClosedAt, setSortClosedAt] = useState<SortOptions | undefined>(undefined)

    const {
        data: resultsTicker,
        isLoading,
        isPending
    } = useResultsTickers({
        ...PLACEHOLDER_QUERY,
        pagination: { count: count, page: page },
        filters: {
            createdAt: {
                min: createdDateMin ? dayjs(createdDateMin)?.startOf('day')?.toISOString() : undefined,
                max: createdDateMax ? dayjs(createdDateMax)?.endOf('day')?.toISOString() : undefined
            },
            closedAt: {
                min: dateMin ? dayjs(dateMin)?.startOf('day')?.toISOString() : undefined,
                max: dateMax ? dayjs(dateMax)?.endOf('day')?.toISOString() : undefined
            },
            tickersIds: valueTicker ? [Number(valueTicker)] : undefined,
            model: model,
            isClosed: isClosed === undefined ? undefined : Boolean(isClosed)
        },
        sorts: {
            createdAt: sortCreated ? sortCreated : undefined,
            pnl: sortPnl ? sortPnl : undefined,
            unrealizedPnl: sortUnrealizedPnl ? sortUnrealizedPnl : undefined,
            isClosed: sortIsClosed ? sortIsClosed : undefined,
            closedAt: sortClosedAt ? sortClosedAt : undefined
        }
    })

    const { data: tickers } = useAvailableTickers()

    if (isLoading) return <Loader />

    const getDirectionIcon = (direction: TickerDirection) => {
        switch (direction) {
            case TickerDirection.LONG:
                return '↗'
            case TickerDirection.SHORT:
                return '↘'
            default:
                return '→'
        }
    }

    const formatPrice = (price: number | null) => {
        if (!price) return '-'
        return `$${price.toFixed(2)}`
    }

    const getTimeframeLabel = (timeframe: TickerTimeFrame) => {
        switch (timeframe) {
            case TickerTimeFrame.OneDay:
                return '1D'
            case TickerTimeFrame.OneWeek:
                return '1W'
            default:
                return timeframe
        }
    }

    return (
        <div className="flex flex-col gap-1">
            <div className="border-primary/50 bg-background/50 flex w-full flex-row flex-wrap items-center justify-between gap-1 rounded-lg border p-4 backdrop-blur">
                <div className="flex flex-row flex-wrap gap-3">
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
                                        ? tickers?.data.find((framework) => framework.id.toString() === valueTicker)
                                              ?.name
                                        : 'Выберите тикер...'}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandList>
                                        <CommandEmpty>Тикеры не найдены</CommandEmpty>
                                        <CommandGroup>
                                            {tickers?.data.map((framework) => (
                                                <CommandItem
                                                    key={framework.id.toString()}
                                                    value={framework.id.toString()}
                                                    onSelect={(currentValue) => {
                                                        setValueTicker(currentValue === valueTicker ? '' : currentValue)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    {framework.name}
                                                    <Check
                                                        className={cn(
                                                            'ml-auto',
                                                            valueTicker === framework.id.toString()
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

                    {/* Фильтр по дате создания - минимум */}
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="created-date-min-picker" className="px-1">
                            Начало создания
                        </Label>
                        <div className="flex flex-row gap-1">
                            <Popover open={openCreatedDateMin} onOpenChange={setOpenCreatedDateMin}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="created-date-min-picker"
                                        className="w-32 justify-between font-normal"
                                    >
                                        {createdDateMin ? createdDateMin.toLocaleDateString() : 'Дата'}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
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
                        </div>
                    </div>

                    {/* Фильтр по дате создания - максимум */}
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="created-date-max-picker" className="px-1">
                            Конец создания
                        </Label>
                        <div className="flex flex-row gap-1">
                            <Popover open={openCreatedDateMax} onOpenChange={setOpenCreatedDateMax}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="created-date-max-picker"
                                        className="w-32 justify-between font-normal"
                                    >
                                        {createdDateMax ? createdDateMax.toLocaleDateString() : 'Дата'}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
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
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="date-picker" className="px-1">
                            Начало закрытия
                        </Label>
                        <div className="flex flex-row gap-1">
                            <Popover open={openDate} onOpenChange={setOpenDate}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date-picker"
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
                                            setOpenDate(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="date-picker" className="px-1">
                            Конец закрытия
                        </Label>
                        <div className="flex flex-row gap-1">
                            <Popover open={openDateMax} onOpenChange={setOpenDateMax}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date-picker"
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
                                            setOpen(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label className="px-1">Модель</Label>
                        <Select value={model} onValueChange={(e) => setModel(e as TickerModels)}>
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Модель" />
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
                        <Label className="px-1">Закрыто</Label>
                        <Select value={isClosed} onValueChange={(e) => setIsClosed(e)}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Закрыто?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={'1'}>Да</SelectItem>
                                <SelectItem value={'0'}>Нет</SelectItem>
                            </SelectContent>
                        </Select>
                        {isClosed && (
                            <Button variant={'outline'} onClick={() => setIsClosed(undefined)}>
                                Сбросить
                            </Button>
                        )}
                    </div>
                </div>
                <div className="flex w-full flex-row flex-wrap items-center gap-7">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-400">Создание</span>
                        <div className="flex flex-row gap-1">
                            <Button
                                onClick={() => setSortCreated((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
                                title="Сортировка по дате создания"
                            >
                                {sortCreated === 'ASC' ? <SortDesc /> : <SortAsc />}
                            </Button>
                            {sortCreated !== undefined && (
                                <Button
                                    variant={'destructive'}
                                    onClick={() => setSortCreated(undefined)}
                                    title="Сбросить сортировку по созданию"
                                >
                                    <Trash />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-400">PNL</span>
                        <div className="flex flex-row gap-1">
                            <Button
                                onClick={() => setSortPnl((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
                                title="Сортировка по PNL"
                            >
                                {sortPnl === 'ASC' ? <SortDesc /> : <SortAsc />}
                            </Button>
                            {sortPnl !== undefined && (
                                <Button
                                    variant={'destructive'}
                                    onClick={() => setSortPnl(undefined)}
                                    title="Сбросить сортировку по PNL"
                                >
                                    <Trash />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-400">Нереал. PNL</span>
                        <div className="flex flex-row gap-1">
                            <Button
                                onClick={() => setSortUnrealizedPnl((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
                                title="Сортировка по нереализованному PNL"
                            >
                                {sortUnrealizedPnl === 'ASC' ? <SortDesc /> : <SortAsc />}
                            </Button>
                            {sortUnrealizedPnl !== undefined && (
                                <Button
                                    variant={'destructive'}
                                    onClick={() => setSortUnrealizedPnl(undefined)}
                                    title="Сбросить сортировку по нереализованному PNL"
                                >
                                    <Trash />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-400">Статус</span>
                        <div className="flex flex-row gap-1">
                            <Button
                                onClick={() => setSortIsClosed((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
                                title="Сортировка по статусу закрытия"
                            >
                                {sortIsClosed === 'ASC' ? <SortDesc /> : <SortAsc />}
                            </Button>
                            {sortIsClosed !== undefined && (
                                <Button
                                    variant={'destructive'}
                                    onClick={() => setSortIsClosed(undefined)}
                                    title="Сбросить сортировку по статусу"
                                >
                                    <Trash />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-400">Закрытие</span>
                        <div className="flex flex-row gap-1">
                            <Button
                                onClick={() => setSortClosedAt((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
                                title="Сортировка по дате закрытия"
                            >
                                {sortClosedAt === 'ASC' ? <SortDesc /> : <SortAsc />}
                            </Button>
                            {sortClosedAt !== undefined && (
                                <Button
                                    variant={'destructive'}
                                    onClick={() => setSortClosedAt(undefined)}
                                    title="Сбросить сортировку по закрытию"
                                >
                                    <Trash />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative overflow-x-auto rounded-lg border border-gray-800/50">
                <table className="w-full min-w-full divide-y divide-gray-800/50">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Тикер
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Направление
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Цена открытия
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Прогноз
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Цена закрытия
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Разница (нереализованная)
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                PNL (unrealizedPnl)
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                SL/TP/Плечо
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                Статус
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/30 bg-transparent">
                        {resultsTicker?.data.count === 0 && (
                            <tr>
                                <td colSpan={10} className="px-6 py-8 text-center text-gray-400">
                                    Ничего не найдено
                                </td>
                            </tr>
                        )}
                        {resultsTicker?.data.data.map((el) => {
                            return (
                                <tr
                                    key={el.id}
                                    className={cn(
                                        'bg-linear-to-r cursor-target group from-transparent via-gray-800/5 to-transparent transition-all duration-300 hover:from-gray-800/10 hover:via-gray-800/20 hover:to-gray-800/10',
                                        el.difference && el.difference > 0
                                            ? 'from-green-500/5 via-green-500/10 to-green-500/5 hover:from-green-500/10 hover:via-green-500/20 hover:to-green-500/10'
                                            : 'from-red-500/5 via-red-500/10 to-red-500/5 hover:from-red-500/10 hover:via-red-500/20 hover:to-red-500/10'
                                    )}
                                >
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground text-sm">{el.model}</span>
                                        </div>
                                        <div className="flex flex-row items-center gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white">{el.ticker.name}</span>
                                                <span
                                                    className={cn(
                                                        'rounded-full border px-2 py-1 text-xs font-medium',
                                                        el.direction === TickerDirection.LONG
                                                            ? 'border-green-400/30 bg-green-400/10 text-green-400'
                                                            : el.direction === TickerDirection.SHORT
                                                              ? 'border-red-400/30 bg-red-400/10 text-red-400'
                                                              : 'border-gray-400/30 bg-gray-400/10 text-gray-400'
                                                    )}
                                                >
                                                    {getTimeframeLabel(el.timeframe)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground text-sm">
                                                {dayjs(el.createdAt).format(DATE_TIME_DEFAULT_FORMAT)}
                                            </span>
                                        </div>
                                        {!el.isPredictAchieved && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground text-sm">
                                                    Цена не дошла то точки
                                                </span>
                                            </div>
                                        )}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    'text-lg font-bold',
                                                    el.direction === TickerDirection.LONG
                                                        ? 'text-green-400'
                                                        : el.direction === TickerDirection.SHORT
                                                          ? 'text-red-400'
                                                          : 'text-gray-400'
                                                )}
                                            >
                                                {getDirectionIcon(el.direction)}
                                            </span>
                                            <span className="text-sm text-gray-300">
                                                {el.direction === TickerDirection.LONG
                                                    ? 'LONG'
                                                    : el.direction === TickerDirection.SHORT
                                                      ? 'SHORT'
                                                      : 'NEUTRAL'}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="font-medium text-white">{formatPrice(el.currentPrice)}</p>
                                        </div>
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="font-medium text-blue-300">
                                                {formatPrice(el.predictedPrice)}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="font-medium text-purple-300">{formatPrice(el.realPrice)}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="space-y-1">
                                            <p>{el.difference}$</p>
                                            <p className="text-muted-foreground text-sm">{el.unrealizedDifference}$</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="space-y-1">
                                            <p>{el.pnl}%</p>
                                            <p className="text-muted-foreground text-sm">{el.unrealizedPnl}%</p>
                                        </div>
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex flex-col gap-1 text-xs">
                                            {el.stopLoss && (
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-muted-foreground">SL:</span>
                                                    <span className="font-medium text-red-400">
                                                        {formatPrice(el.stopLoss)}
                                                    </span>
                                                </div>
                                            )}
                                            {el.takeProfit && (
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-muted-foreground">TP:</span>
                                                    <span className="font-medium text-green-400">
                                                        {formatPrice(el.takeProfit)}
                                                    </span>
                                                </div>
                                            )}
                                            {!el.stopLoss && !el.takeProfit && <span className="text-gray-500">-</span>}
                                            <div className="flex flex-row items-center gap-1">
                                                <p className="text-muted-foreground">Плечо:</p>
                                                <p className="text-sm text-white">
                                                    {el.leverage ? `${el.leverage}x` : '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="space-y-1">
                                            <p
                                                className={cn(
                                                    'text-sm font-medium',
                                                    el.isClosed ? 'text-yellow-400' : 'text-green-400'
                                                )}
                                            >
                                                {el.isClosed ? 'Завершён' : 'Активен'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-row gap-1">
                <Pagination
                    totalItems={resultsTicker?.data.count}
                    page={page}
                    count={count}
                    handlePageChange={(e) => setPage(e)}
                    handleItemsPerPageChange={(e) => {
                        setPage(1)
                        setCount(Number(e))
                    }}
                />
                {isPending && <p>Загрузка...</p>}
            </div>
            <p className="text-muted-foreground px-2 text-sm">
                * SL/TP/Плечо не влияет на рассчеты, носит чисто информативный характер от ИИ
            </p>
        </div>
    )
}
