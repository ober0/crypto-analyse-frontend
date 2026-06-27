import apiClient from '@/shared/api'
import { AxiosPromise } from 'axios'
import { User } from '../model/user'
import { useQuery } from '@tanstack/react-query'
import { ApiQueryKeys } from '@/shared/config'

const self = async (): AxiosPromise<User> => {
    const res = await apiClient.get('/user/self')

    return res
}

export const useSelf = () =>
    useQuery({
        queryKey: [ApiQueryKeys.USER],
        queryFn: self
    })
