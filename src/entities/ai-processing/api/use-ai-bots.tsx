import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { RequestData, ResponseData } from '@/shared/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosPromise } from 'axios'
import {
    AiBot,
    AiBotDetail,
    AiBotListItem,
    AiBotsFilters,
    AiBotsSorts,
    CreateAiBotRequest
} from '../model/ai-bot'

const searchAiBots = async (
    data: RequestData<AiBotListItem, AiBotsFilters, AiBotsSorts>
): ResponseData<AiBotListItem[]> => {
    const res = await apiClient.post('/ai-processing/search', data)

    return res
}

const getAiBot = async (id: number): AxiosPromise<AiBotDetail> => {
    const res = await apiClient.get(`/ai-processing/${id}`)

    return res
}

const createAiBot = async (data: CreateAiBotRequest): AxiosPromise<AiBot> => {
    const res = await apiClient.post('/ai-processing', data)

    return res
}

const enableAiBot = async (id: number): AxiosPromise<AiBot> => {
    const res = await apiClient.post(`/ai-processing/${id}/enable`)

    return res
}

const disableAiBot = async (id: number): AxiosPromise<AiBot> => {
    const res = await apiClient.post(`/ai-processing/${id}/disable`)

    return res
}

const deleteAiBot = async (id: number): AxiosPromise<AiBot> => {
    const res = await apiClient.delete(`/ai-processing/${id}`)

    return res
}

export const useSearchAiBots = (data: RequestData<AiBotListItem, AiBotsFilters, AiBotsSorts>) =>
    useQuery({
        queryKey: [ApiQueryKeys.AI_BOTS, data],
        queryFn: () => searchAiBots(data)
    })

export const useGetAiBot = (id: number | null) =>
    useQuery({
        queryKey: [ApiQueryKeys.AI_BOT_DETAIL, id],
        queryFn: () => getAiBot(id!),
        enabled: id != null
    })

export const useCreateAiBot = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.AI_BOTS_CREATE],
        mutationFn: createAiBot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.AI_BOTS] })
        }
    })
}

export const useEnableAiBot = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.AI_BOTS_ENABLE],
        mutationFn: enableAiBot,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.AI_BOTS] })
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.AI_BOT_DETAIL, id] })
        }
    })
}

export const useDisableAiBot = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.AI_BOTS_DISABLE],
        mutationFn: disableAiBot,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.AI_BOTS] })
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.AI_BOT_DETAIL, id] })
        }
    })
}

export const useDeleteAiBot = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.AI_BOTS_DELETE],
        mutationFn: deleteAiBot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.AI_BOTS] })
        }
    })
}
