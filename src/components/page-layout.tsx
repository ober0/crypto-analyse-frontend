import { cn } from '@/shared/utils'
import type { ReactNode } from 'react'

export const PageHeader = ({ title, description }: { title: string; description?: string }) => (
    <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
    </div>
)

export const PageSection = ({
    title,
    description,
    children,
    className
}: {
    title: string
    description?: string
    children: ReactNode
    className?: string
}) => (
    <section className={cn('flex flex-col gap-3', className)}>
        <div className="flex flex-col gap-0.5">
            <h2 className="text-lg font-semibold">{title}</h2>
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>
        {children}
    </section>
)

export const GlassPanel = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cn('border-primary/50 bg-background/50 rounded-xl border p-3 backdrop-blur sm:p-4', className)}>
        {children}
    </div>
)

export const FilterGroupTitle = ({ children }: { children: ReactNode }) => (
    <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">{children}</p>
)

export const FilterField = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-muted-foreground px-0.5 text-xs font-medium">{label}</label>
        {children}
    </div>
)
