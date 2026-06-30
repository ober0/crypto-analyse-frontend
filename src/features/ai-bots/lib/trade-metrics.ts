import { Trade, TradeDirection } from '@/entities/ai-processing/model/ai-bot'
import { toNumber } from './format'

export interface TradeMetrics {
    invested: number
    pnl: number | null
    pnlPercent: number | null
    currentValue: number | null
    takeProfitValue: number | null
}

export const calcTradeMetrics = (trade: Trade): TradeMetrics | null => {
    const entryPrice = toNumber(trade.averageEntryPrice)
    const currentPrice = toNumber(trade.currentPrice)
    const size = toNumber(trade.currentSize)
    const takeProfit = toNumber(trade.takeProfit)
    const storedPnl = toNumber(trade.pnl)

    if (entryPrice == null || size == null) return null

    const invested = entryPrice * size

    const pnl =
        storedPnl ??
        (currentPrice != null
            ? trade.direction === TradeDirection.Long
                ? (currentPrice - entryPrice) * size
                : (entryPrice - currentPrice) * size
            : null)

    const pnlPercent = pnl != null && invested > 0 ? (pnl / invested) * 100 : null
    const currentValue = currentPrice != null ? currentPrice * size : null
    const takeProfitValue = takeProfit != null ? takeProfit * size : null

    return { invested, pnl, pnlPercent, currentValue, takeProfitValue }
}
