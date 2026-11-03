<script setup lang="ts">
import { ref } from 'vue'
import { tickets as sample } from '@/mock/tickets'
import TicketCard from '@/components/TicketCard.vue'

const tickets = ref(sample)
const message = ref('')

function onOpen(id: number) {
  message.value = `Opened ticket ${id}`
}
</script>

<template>
  <main class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">My tickets</h1>
        <p class="muted">{{ tickets.length }} tickets</p>
      </div>
      <button class="btn btn-primary" type="button">New ticket</button>
    </div>

    <p v-if="message" class="banner">{{ message }}</p>
    <div v-if="tickets.length === 0" class="surface empty">No tickets yet.</div>

    <TicketCard v-for="ticket in tickets" :key="ticket.id" :ticket="ticket" @open="onOpen" />
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
