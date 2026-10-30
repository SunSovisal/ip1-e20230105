export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Ticket {
    id: number
    title: string
    status: TicketStatus
    priority: TicketPriority
    categoryPath: string
    description: string
    area?: string
}