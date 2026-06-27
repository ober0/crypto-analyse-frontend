import { Role } from '@/entities/role/model/role'

export interface User {
    id: number
    username: string
    roleId: number
    isActive: true
    createdAt: string
    role: Role
}
