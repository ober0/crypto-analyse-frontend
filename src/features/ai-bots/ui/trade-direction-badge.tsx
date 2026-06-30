import { TradeDirection } from '@/entities/ai-processing/model/ai-bot'
import { cn } from '@/shared/utils'
import { TRADE_DIRECTION_LABELS, TRADE_DIRECTION_TONES } from '../lib/labels'

interface TradeDirectionBadgeProps {
    direction: TradeDirection
    className?: string
}

export const TradeDirectionBadge = ({ direction, className }: TradeDirectionBadgeProps) => (
    <span
        className={cn(
            'rounded-full border px-2 py-0.5 text-[10px] font-semibold',
            TRADE_DIRECTION_TONES[direction],
            className
        )}
    >
        {TRADE_DIRECTION_LABELS[direction]}
    </span>
)
