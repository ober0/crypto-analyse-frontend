export const isPresent = <T>(value: T | null | undefined): value is T =>
    value !== null && value !== undefined

export const formatUsd = (price: number | null | undefined) =>
    isPresent(price) ? `$${price.toFixed(2)}` : null

export const formatPercent = (value: number | null | undefined) => {
    if (!isPresent(value)) return null

    const sign = value > 0 ? '+' : ''
    return `${sign}${value}%`
}

export const formatSignedUsd = (value: number | null | undefined) => {
    if (!isPresent(value)) return null

    const sign = value > 0 ? '+' : ''
    return `${sign}${value}$`
}

export const formatLeverage = (leverage: number | null | undefined) =>
    isPresent(leverage) ? `${leverage}x` : null

export const formatTokens = (value: number) => value.toLocaleString('ru-RU')
