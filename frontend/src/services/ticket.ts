import type { Ticket, TicketPriority } from '@/types/ticket'
import type { Comment } from '@/types/comment'
import { tickets as seedTickets } from '@/mock/tickets'
import { comment as seedComments } from '@/mock/comments'

const STORAGE_KEY = 'helpdesk.tickets'

function readSaved(): Ticket[] {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : [...seedTickets]
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
    ...input,
    id: Math.max(0, ...tickets.map((t) => t.id)) + 1,
    status: 'OPEN',
    area: input.area || undefined,
  }
  tickets.push(ticket)
  save()
  return delay(ticket)
}
