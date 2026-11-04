<script setup lang="ts">
import { onMounted } from 'vue'
import TicketCard from '@/components/TicketCard.vue'
import { useTicketStore } from '@/stores/tickets'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const store = useTicketStore()
const { tickets, loading, error } = storeToRefs(store)
const router = useRouter()
onMounted(() => store.loadTickets())

function onOpen(id: number) {
  router.push({ name: 'ticket-detail', params: { id } })
}
</script>

<template>
  <main class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">My tickets</h1>
        <p class="muted">{{ tickets.length }} tickets</p>
      </div>
      <RouterLink class="btn btn-primary" :to="{ name: 'ticket-new' }">New ticket</RouterLink>
    </div>
    <p v-if="error" class="banner banner-error">{{ error }}</p>
    <div v-else-if="loading" class="surface empty">Loading tickets…</div>
    <div v-else-if="tickets.length === 0" class="surface empty">No tickets yet.</div>
    <template v-else>
      <TicketCard v-for="ticket in tickets" :key="ticket.id" :ticket="ticket" @open="onOpen" />
    </template>
  </main>
</template>

<style scoped>
.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}
</style>
