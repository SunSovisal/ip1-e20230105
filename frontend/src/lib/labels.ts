import type { TicketPriority, TicketStatus } from '@/types/ticket'

export function statusLabel(status: TicketStatus): string {
  switch (status) {
    case 'OPEN':
      return 'Open'
    case 'IN_PROGRESS':
      return 'In progress'
    case 'RESOLVED':
      return 'Resolved'
    case 'CLOSED':
      return 'Closed'
  }
}

export function priorityLabel(priority: TicketPriority): string {
  switch (priority) {
    case 'LOW':
      return 'Low'
    case 'MEDIUM':
      return 'Medium'
    case 'HIGH':
      return 'High'
  }
}
