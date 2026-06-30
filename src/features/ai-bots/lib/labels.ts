import {
    ProcessingInterval,
    ProcessingLogType,
    ProcessingStatus,
    TradeActionType,
    TradeDirection,
    TradeStatus
} from '@/entities/ai-processing/model/ai-bot'
import { formatModelLabel } from '@/shared/lib/format-model-label'

export const STATUS_LABELS: Record<ProcessingStatus, string> = {
    [ProcessingStatus.Ready]: 'Готов',
    [ProcessingStatus.Active]: 'Активен',
    [ProcessingStatus.InOrder]: 'В сделке',
    [ProcessingStatus.End]: 'Завершён',
    [ProcessingStatus.Error]: 'Ошибка'
}

export const STATUS_TONES: Record<ProcessingStatus, string> = {
    [ProcessingStatus.Ready]: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
    [ProcessingStatus.Active]: 'text-green-400 border-green-400/30 bg-green-400/10',
    [ProcessingStatus.InOrder]: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
    [ProcessingStatus.End]: 'text-gray-400 border-gray-400/30 bg-gray-400/10',
    [ProcessingStatus.Error]: 'text-red-400 border-red-400/30 bg-red-400/10'
}

export const INTERVAL_LABELS: Record<ProcessingInterval, string> = {
    [ProcessingInterval.OneDay]: '1 день',
    [ProcessingInterval.OneWeek]: '1 неделя',
    [ProcessingInterval.OneMonth]: '1 месяц'
}

export const formatBotModel = (model: string) => formatModelLabel(model)

export const canEnable = (status: ProcessingStatus) =>
    status === ProcessingStatus.Ready

export const canDisable = (status: ProcessingStatus) =>
    status === ProcessingStatus.Active || status === ProcessingStatus.InOrder

export const canDelete = (status: ProcessingStatus) =>
    status === ProcessingStatus.Ready || status === ProcessingStatus.End || status === ProcessingStatus.Error

export const TRADE_DIRECTION_LABELS: Record<TradeDirection, string> = {
    [TradeDirection.Long]: 'лонг',
    [TradeDirection.Short]: 'шорт'
}

export const TRADE_DIRECTION_TONES: Record<TradeDirection, string> = {
    [TradeDirection.Long]: 'text-green-400 border-green-400/30 bg-green-400/10',
    [TradeDirection.Short]: 'text-red-400 border-red-400/30 bg-red-400/10'
}

export const TRADE_STATUS_LABELS: Record<TradeStatus, string> = {
    [TradeStatus.Open]: 'открыта',
    [TradeStatus.Closed]: 'закрыта',
    [TradeStatus.InOrder]: 'в ордере'
}

export const TRADE_STATUS_TONES: Record<TradeStatus, string> = {
    [TradeStatus.Open]: 'text-green-400 border-green-400/30 bg-green-400/10',
    [TradeStatus.Closed]: 'text-gray-400 border-gray-400/30 bg-gray-400/10',
    [TradeStatus.InOrder]: 'text-amber-400 border-amber-400/30 bg-amber-400/10'
}

export const TRADE_ACTION_LABELS: Record<string, string> = {
    [TradeActionType.Open]: 'Открытие',
    [TradeActionType.Buy]: 'Докупка',
    [TradeActionType.Sell]: 'Продажа',
    [TradeActionType.PartialSell]: 'Частичная продажа',
    [TradeActionType.Change_sl_tp]: 'Изменение SL/TP'
}

export const LOG_TYPE_LABELS: Record<string, string> = {
    [ProcessingLogType.TradeOpen]: 'Открытие сделки',
    [ProcessingLogType.TradeClose]: 'Закрытие сделки',
    [ProcessingLogType.TradeActive]: 'Активность',
    [ProcessingLogType.TradePass]: 'Пропуск'
}
