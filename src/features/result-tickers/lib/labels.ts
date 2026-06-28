import { TickerDirection, TickerModels, TickerTimeFrame } from '@/entities/ticker-results/model/ticker'

export const MODEL_LABELS: Record<TickerModels, string> = {
    [TickerModels.GPT5]: 'GPT-5',
    [TickerModels.DEEPSEEK4FLASH]: 'DeepSeek v4 flash',
    [TickerModels.LLAMA4]: 'Llama 4'
}

export const getDirectionIcon = (direction: TickerDirection) => {
    switch (direction) {
        case TickerDirection.LONG:
            return '↗'
        case TickerDirection.SHORT:
            return '↘'
        default:
            return '→'
    }
}

export const getDirectionLabel = (direction: TickerDirection) => {
    switch (direction) {
        case TickerDirection.LONG:
            return 'LONG'
        case TickerDirection.SHORT:
            return 'SHORT'
        default:
            return 'NEUTRAL'
    }
}

export const getTimeframeLabel = (timeframe: TickerTimeFrame) => {
    switch (timeframe) {
        case TickerTimeFrame.OneDay:
            return '1D'
        case TickerTimeFrame.OneWeek:
            return '1W'
        default:
            return timeframe
    }
}
