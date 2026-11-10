import { categoryAndDescendantIds } from '@/lib/catalog'
import type { CatalogNode } from '@/types/catalog'
import type { Ticket, TicketPriority, TicketStatus } from '@/types/ticket'

export const TICKET_PAGE_SIZE = 5

export interface TicketFilterValue {
  query: string
  status: TicketStatus | ''
  priority: TicketPriority | ''
  categoryId: number | null
  area: string
  tagId: number | null
}

export const emptyTicketFilters = (): TicketFilterValue => ({
  query: '',
  status: '',
  priority: '',
  categoryId: null,
  area: '',
  tagId: null,
})

export function matchesTicketFilters(
  ticket: Ticket,
  filters: TicketFilterValue,
  categories: CatalogNode[],
): boolean {
  const query = filters.query.trim().toLowerCase()
  if (query && !ticket.title.toLowerCase().includes(query)) return false
  if (filters.status && ticket.status !== filters.status) return false
  if (filters.priority && ticket.priority !== filters.priority) return false
  if (filters.categoryId != null) {
    const ids = categoryAndDescendantIds(filters.categoryId, categories)
    if (!ids.has(ticket.categoryId)) return false
  }
  const area = filters.area.trim().toLowerCase()
  if (area && !(ticket.area ?? '').toLowerCase().includes(area)) return false
  if (filters.tagId != null && !ticket.tagIds.includes(filters.tagId)) return false
  return true
}

export function pageCountFor(total: number, pageSize: number): number {
  if (pageSize < 1) return 1
  return Math.max(1, Math.ceil(total / pageSize))
}

export function pageOf<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}
