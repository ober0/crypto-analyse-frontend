import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { pageSizeOptions } from '@/shared/types'
import { FC } from 'react'
import { Button } from './ui/button'
import { Loader } from './loader'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface PaginationProps {
    totalItems: number | undefined
    page: number
    count: number
    handlePageChange: (newPage: number) => void
    handleItemsPerPageChange: (value: string) => void
    isLoading?: boolean
}

export const Pagination: FC<PaginationProps> = ({
    totalItems = 0,
    page,
    count,
    handlePageChange,
    handleItemsPerPageChange,
    isLoading
}) => {
    const totalPages = Math.ceil(totalItems / count)

    const renderPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5
        let startPage = 1
        let endPage = totalPages

        if (totalPages > maxVisiblePages) {
            const half = Math.floor(maxVisiblePages / 2)
            startPage = Math.max(1, page - half)
            endPage = Math.min(totalPages, page + half)

            if (page <= half + 1) {
                endPage = maxVisiblePages
            } else if (page >= totalPages - half) {
                startPage = totalPages - maxVisiblePages + 1
            }
        }

        // Always show first page
        if (startPage > 1) {
            pages.push(
                <Button
                    key={1}
                    variant={page === 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    className="cursor-target h-10 w-10"
                >
                    1
                </Button>
            )

            if (startPage > 2) {
                pages.push(
                    <Button key="ellipsis-start" variant="ghost" size="sm" disabled className="cursor-target h-10 w-10">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                )
            }
        }

        // Render visible pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={page === i ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(i)}
                    className="cursor-target h-10 w-10"
                >
                    {i}
                </Button>
            )
        }

        // Always show last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <Button key="ellipsis-end" variant="ghost" size="sm" disabled className="cursor-target h-10 w-10">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                )
            }

            pages.push(
                <Button
                    key={totalPages}
                    variant={page === totalPages ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    className="cursor-target h-10 w-10"
                >
                    {totalPages}
                </Button>
            )
        }

        return pages
    }

    return (
        <div className="flex flex-col items-center justify-between gap-1 px-2 py-4 lg:flex-row">
            <div className="text-muted-foreground flex-1 text-sm">
                Показано {(page - 1) * count + 1}-{Math.min(page * count, totalItems)} из {totalItems} элементов
            </div>
            <div className="flex flex-wrap items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Элементов на странице</p>
                    <Select value={count.toString()} onValueChange={handleItemsPerPageChange}>
                        <SelectTrigger className="h-8 w-max">
                            <SelectValue placeholder={count.toString()} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {isLoading && <Loader />}
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="cursor-target h-10 w-10"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {renderPageNumbers()}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages || totalPages === 0}
                        className="cursor-target h-10 w-10"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
