import { TickerModels } from '@/entities/ticker-results/model/ticker'

export enum ProcessingStatus {
    Ready = 'Ready',
    Active = 'Active',
    InOrder = 'InOrder',
    End = 'End',
    Error = 'Error'
}

export enum ProcessingInterval {
    OneDay = 'OneDay',
    OneWeek = 'OneWeek',
    OneMonth = 'OneMonth'
}

export enum TradeDirection {
    Long = 'Long',
    Short = 'Short'
}

export enum TradeStatus {
    Open = 'Open',
    Closed = 'Closed',
    InOrder = 'InOrder'
}

export enum ProcessingLogType {
    TradeOpen = 'TradeOpen',
    TradeClose = 'TradeClose',
    TradeActive = 'TradeActive',
    TradePass = 'TradePass'
}

export interface AiBotTicker {
    id: number
    name: string
}

export interface AiBot {
    id: number
    tickersId: number
    model: TickerModels
    checkIntervalMins: number
    lastCheckAt: string | null
    nextCheckAt: string | null
    startAt: string | null
    endAt: string | null
    interval: ProcessingInterval
    customPrompt: string | null
    withWebSearch: boolean
    status: ProcessingStatus
    createdAt: string
    ticker: AiBotTicker
}

export interface AiBotListItem extends AiBot {
    tradesCount: number
    averagePnl: number | string | null
    totalPnl: number | string | null
    averagePnlPercent: number | string | null
    totalPnlPercent: number | string | null
}

export enum TradeActionType {
    Open = 'Open',
    Buy = 'Buy',
    Sell = 'Sell',
    PartialSell = 'PartialSell',
    Change_sl_tp = 'Change_sl_tp'
}

export interface TradeAction {
    id: number
    tradeId: number
    type: TradeActionType | string
    quantity: number | string | null
    price: number | string | null
    stopLoss: number | string | null
    oldStopLoss: number | string | null
    takeProfit: number | string | null
    oldTakeProfit: number | string | null
    comment: string | null
    createdAt: string
}

export interface Trade {
    id: number
    tickerId: number
    confidence: number
    mainTimeframe: string
    invalidationLevel: number
    liquidityZone: string | null
    direction: TradeDirection
    status: TradeStatus
    currentSize: number | string
    averageEntryPrice: number | string
    currentPrice: number | string
    aiProcessingId: number
    stopLoss: number | string | null
    takeProfit: number | string | null
    pnl: number | string | null
    closeReason: string | null
    openedAt: string
    closedAt: string | null
    openDescription: string | null
    closeDescription: string | null
    createdAt: string
    updatedAt: string
    actions: TradeAction[]
}

export interface ProcessingLog {
    id: number
    type: ProcessingLogType | string
    text: string
    aiProcessingId: number
    createdAt: string
}

export interface AiBotDetail extends AiBot {
    trades: Trade[]
    logs: ProcessingLog[]
}

export interface CreateAiBotRequest {
    tickersId: number
    model: TickerModels
    checkIntervalMins: number
    interval: ProcessingInterval
    customPrompt?: string
    withWebSearch?: boolean
}

export interface UpdateAiBotRequest {
    checkIntervalMins?: number
    customPrompt?: string
    withWebSearch?: boolean
}

export interface AiBotsFilters {
    tickersIds?: number[]
    tickersId?: number
    model?: TickerModels
    status?: ProcessingStatus
    statuses?: ProcessingStatus[]
    interval?: ProcessingInterval
    withWebSearch?: boolean
}

export interface AiBotsSorts {
    endAt?: 'ASC' | 'DESC'
    status?: 'ASC' | 'DESC'
}
