import { createTicket, fetchTickets, type NewTicketInput } from '@/services/ticket'
import type { Ticket } from '@/types/ticket'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTicketStore = defineStore('tickets', () => {
  const tickets = ref<Ticket[]>([])
  const loading = ref(false)
  const error = ref('')

  async function loadTickets() {
    loading.value = true
    error.value = ''
    try {
      tickets.value = await fetchTickets()
    } catch {
      error.value = 'Could not load tickets.'
    } finally {
      loading.value = false
    }
  }

  async function addTicket(input: NewTicketInput) {
    const ticket = await createTicket(input)
    tickets.value.push(ticket)
    return ticket
  }

  return { tickets, loading, error, loadTickets, addTicket }
})
