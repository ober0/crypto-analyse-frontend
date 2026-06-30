export const toNumber = (value: number | string | null | undefined): number | null => {
    if (value == null || value === '') return null

    const num = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(num) ? num : null
}

export const formatPnl = (value: number | string | null | undefined) => {
    const num = toNumber(value)
    if (num == null) return null

    const sign = num > 0 ? '+' : ''
    return `${sign}${num.toFixed(2)}`
}

export const formatPnlPercent = (value: number | string | null | undefined) => {
    const num = toNumber(value)
    if (num == null) return null

    const sign = num > 0 ? '+' : ''
    return `${sign}${num.toFixed(2)}%`
}

export const formatUsd = (value: number | string | null | undefined) => {
    const num = toNumber(value)
    if (num == null) return null

    return `$${num.toFixed(2)}`
}

export const formatPrice = (value: number | string | null | undefined) => {
    const num = toNumber(value)
    if (num == null) return null

    return num.toFixed(2)
}

export const isPositive = (value: number | string | null | undefined) => {
    const num = toNumber(value)
    return num != null && num > 0
}

export const formatQuantity = (value: number | string | null | undefined) => {
    const num = toNumber(value)
    if (num == null) return null

    return num.toFixed(4).replace(/\.?0+$/, '')
}

export const formatConfidence = (value: number | string | null | undefined) => {
    const num = toNumber(value)
    if (num == null) return null

    const percent = num <= 1 ? num * 100 : num
    return `${Math.round(percent)}%`
}
