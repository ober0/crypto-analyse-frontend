'use client'

import { ProcessingLog } from '@/entities/ai-processing/model/ai-bot'
import { DATE_TIME_DEFAULT_FORMAT } from '@/shared/config'
import dayjs from 'dayjs'
import { LOG_TYPE_LABELS } from '../lib/labels'

interface AiBotLogsTabProps {
    logs: ProcessingLog[]
}

export const AiBotLogsTab = ({ logs }: AiBotLogsTabProps) => {
    if (logs.length === 0) {
        return <p className="text-muted-foreground py-8 text-center text-sm">Логов пока нет</p>
    }

    const sortedLogs = [...logs].sort(
        (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    )

    return (
        <div className="flex flex-col gap-2">
            {sortedLogs.map((log) => (
                <div
                    key={log.id}
                    className="rounded-lg border border-white/5 bg-black/20 px-3 py-2.5 text-xs"
                >
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">
                            {LOG_TYPE_LABELS[log.type] ?? log.type}
                        </span>
                        <span className="text-muted-foreground tabular-nums">
                            {dayjs(log.createdAt).format(DATE_TIME_DEFAULT_FORMAT)}
                        </span>
                    </div>
                    <p className="whitespace-pre-wrap">{log.text}</p>
                </div>
            ))}
        </div>
    )
}
