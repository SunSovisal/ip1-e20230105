export type Role = 'REQUESTER' | 'AGENT' | 'ADMIN'

export interface User {
    id: number
    name: string
    email: string
    role: Role
}

export interface Account extends User {
    password: string
}