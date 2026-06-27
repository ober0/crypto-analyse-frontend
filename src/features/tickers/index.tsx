/* eslint-disable react-perf/jsx-no-new-object-as-prop */
'use client'

import { Loader } from '@/components/loader'
import { useAvailableTickers } from '@/entities/ticker-results/api/use-get-tickers'

export const AvailableTickers = () => {
    const { data: tickers, isLoading } = useAvailableTickers()

    if (isLoading) return <Loader />

    return (
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-6">
            {tickers?.data.map((el) => (
                <div key={el.id} className="relative flex flex-col gap-1 rounded-lg p-4">
                    <div
                        className="-z-100 absolute inset-0 rounded-lg"
                        style={{
                            background: `linear-gradient(45deg, #1a1a1a 0%, #003366 100%),
        repeating-linear-gradient(
          45deg,
          rgba(0, 255, 255, 0.1) 0px,
          rgba(0, 255, 255, 0.1) 20px,
          rgba(0, 255, 0, 0.1) 20px,
          rgba(0, 255, 0, 0.1) 40px
        ),
        radial-gradient(
          circle at 50% 50%,
          rgba(32, 196, 232, 0.3) 0%,
          rgba(76, 201, 240, 0.1) 100%
        )`,
                            backgroundBlendMode: 'normal, overlay, overlay'
                        }}
                    />
                    <p className="text-muted-foreground text-sm">{el.id}</p>
                    <p>{el.name}</p>
                    <p className="text-muted-foreground text-sm">Количество прогонов: {el.processCount}</p>
                </div>
            ))}
        </div>
    )
}
