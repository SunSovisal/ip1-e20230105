<script setup lang="ts">
import type { Ticket } from '@/types/ticket'

const props = defineProps<{
  ticket: Ticket
}>()

const emit = defineEmits<{
  open: [id: number]
}>()
</script>

<template>
  <article class="card">
    <h2>{{ props.ticket.title }}</h2>
    <p>{{ ticket.categoryPath }}</p>
    <p>{{ ticket.status }} {{ ticket.priority }}</p>
    <button type="button" @click="emit('open', ticket.id)">Open</button>
  </article>
</template>

<style scoped>
.card {
  border: 1px solid #111;
  padding: 12px 16px;
  margin-bottom: 12px;
}
h2 {
  margin: 0 0 8px;
  font-size: 18px;
}
p {
  margin: 0 0 8px;
}
</style>