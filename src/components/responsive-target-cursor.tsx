'use client'

import { useEffect, useState } from 'react'
import TargetCursor from './TargetCursor'

const FINE_POINTER_QUERY = '(pointer: fine) and (min-width: 768px)'

export default function ResponsiveTargetCursor() {
    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia(FINE_POINTER_QUERY)
        const update = () => setEnabled(mediaQuery.matches)

        update()
        mediaQuery.addEventListener('change', update)

        return () => mediaQuery.removeEventListener('change', update)
    }, [])

    if (!enabled) return null

    return <TargetCursor spinDuration={7} hideDefaultCursor />
}
