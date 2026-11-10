export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Ticket {
  id: number
  title: string
  status: TicketStatus
  priority: TicketPriority
  categoryId: number
  categoryPath: string
  tagIds: number[]
  description: string
  area?: string
  assigneeName: string | null
  requesterName?: string
  requesterEmail?: string
}
