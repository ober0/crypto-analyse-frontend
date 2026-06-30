'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

interface ConfirmActionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    confirmLabel: string
    loading?: boolean
    destructive?: boolean
    onConfirm: () => void
}

export const ConfirmActionDialog = ({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    loading,
    destructive,
    onConfirm
}: ConfirmActionDialogProps) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-4 sm:max-w-sm" showCloseButton={false}>
            <DialogHeader className="gap-1.5">
                <DialogTitle className="text-base">{title}</DialogTitle>
                <DialogDescription className="text-sm leading-relaxed">{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:justify-end">
                <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} disabled={loading}>
                    Отмена
                </Button>
                <Button
                    size="sm"
                    variant={destructive ? 'destructive' : 'default'}
                    onClick={onConfirm}
                    loading={loading}
                >
                    {confirmLabel}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)
