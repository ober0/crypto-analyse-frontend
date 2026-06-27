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
    DEEPSEEKR1T = 'DeepseekR1T',
    QWEN3 = 'Llama4'
}
