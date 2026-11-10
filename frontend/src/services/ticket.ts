import { categoryIdForPath } from '@/lib/catalog'
import { categoryNodes } from '@/mock/categories'
import { tickets as seedTickets } from '@/mock/tickets'
import type { Comment } from '@/types/comment'
import type { Ticket, TicketPriority } from '@/types/ticket'
import { comment as seedComments } from '@/mock/comments'

const STORAGE_KEY = 'helpdesk.tickets'

function copySeed(): Ticket[] {
  return seedTickets.map((ticket) => ({ ...ticket, tagIds: [...ticket.tagIds] }))
}

function isStoredTicket(item: unknown): item is Ticket {
  return (
    !!item &&
    typeof item === 'object' &&
    'id' in item &&
    'title' in item &&
    'categoryId' in item &&
    'tagIds' in item &&
    'assigneeName' in item
  )
}

function readSaved(): Ticket[] {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return copySeed()
  try {
    const parsed: unknown = JSON.parse(saved)
    if (!Array.isArray(parsed) || parsed.some((item) => !isStoredTicket(item))) {
      const fresh = copySeed()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
      return fresh
    }
    return parsed.map((ticket) => ({ ...ticket, tagIds: [...ticket.tagIds] }))
  } catch {
    return copySeed()
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
}

const tickets: Ticket[] = readSaved()

export interface NewTicketInput {
  title: string
  description: string
  priority: TicketPriority
  categoryPath: string
  area: string
  tagIds: number[]
}

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export function fetchTickets(): Promise<Ticket[]> {
  return delay([...tickets])
}

export function fetchTicket(id: number): Promise<Ticket | null> {
  return delay(tickets.find((t) => t.id === id) ?? null)
}

export function fetchComments(ticketId: number): Promise<Comment[]> {
  return delay(seedComments.filter((c) => c.ticketId === ticketId))
}

export function createTicket(input: NewTicketInput): Promise<Ticket> {
  const ticket: Ticket = {
    id: Math.max(0, ...tickets.map((t) => t.id)) + 1,
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: 'OPEN',
    categoryPath: input.categoryPath,
    categoryId: categoryIdForPath(input.categoryPath, categoryNodes) ?? 0,
    tagIds: [...input.tagIds],
    area: input.area || undefined,
    assigneeName: null,
  }
  tickets.push(ticket)
  save()
  return delay(ticket)
}
