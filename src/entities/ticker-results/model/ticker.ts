export interface TickerUsage {
    id: number
    model: TickerModels
    response: number
    prompt: number
    createdAt: string
}

export interface Ticker {
    id: number
    name: string
    processCount: number
}

export interface ResultTicker {
    id: number
    tickersId: number
    timeframe: TickerTimeFrame
    direction: TickerDirection
    leverage: number | null
    stopLoss: number | null
    takeProfit: number | null
    currentPrice: number | null
    predictedPrice: number | null
    realPrice: number | null
    difference: number | null
    unrealizedDifference: number | null
    pnl: number | null
    unrealizedPnl: number | null
    isPredictAchieved: boolean
    leverageDifference: number | null
    percentDifference: number | null
    isClosed: boolean
    closedAt: number | null
    createdAt: string
    ticker: Omit<Ticker, 'processCount'>
    model: TickerModels
    usageId: number | null
    usage: TickerUsage | null
}

export enum TickerDirection {
    LONG = 'Long',
    SHORT = 'Short',
    NOTHING = 'Nothing'
}

export enum TickerTimeFrame {
    OneDay = 'OneDay',
    OneWeek = 'OneWeek'
}

export enum TickerModels {
    GPT5 = 'Gpt5',
    DEEPSEEK4FLASH = 'Deepseek4Flash',
    LLAMA4 = 'Llama4'
}
