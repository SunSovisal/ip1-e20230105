import { describe, expect, it } from 'vitest'
import { categoryNodes } from '@/mock/categories'
import { tickets } from '@/mock/tickets'
import {
  emptyTicketFilters,
  matchesTicketFilters,
  pageCountFor,
  pageOf,
  TICKET_PAGE_SIZE,
} from '@/lib/ticketList'

const match = (patch: Partial<ReturnType<typeof emptyTicketFilters>>) =>
  tickets.filter((ticket) =>
    matchesTicketFilters(ticket, { ...emptyTicketFilters(), ...patch }, categoryNodes),
  )

describe('ticket list filters', () => {
  it('searches the title without caring about case', () => {
    expect(match({ query: 'wi-fi' }).map((ticket) => ticket.id)).toEqual([2])
  })

  it('includes tickets under a parent category', () => {
    const ids = match({ categoryId: 1 })
      .map((ticket) => ticket.id)
      .sort()
    expect(ids).toEqual([1, 2, 5])
  })

  it('matches a tag exactly and not its parent', () => {
    expect(match({ tagId: 1 })).toEqual([])
    expect(match({ tagId: 2 }).map((ticket) => ticket.id)).toEqual([1, 2, 5, 6])
  })

  it('matches area when the stored place contains the text', () => {
    expect(match({ area: 'lab b' }).map((ticket) => ticket.id)).toEqual([4, 5])
    expect(match({ area: 'J609' }).map((ticket) => ticket.id)).toEqual([1])
  })

  it('pages five tickets at a time and keeps a page when the list is empty', () => {
    expect(pageCountFor(tickets.length, TICKET_PAGE_SIZE)).toBe(2)
    expect(pageOf(tickets, 2, TICKET_PAGE_SIZE)).toHaveLength(1)
    expect(pageCountFor(0, TICKET_PAGE_SIZE)).toBe(1)
  })
})
