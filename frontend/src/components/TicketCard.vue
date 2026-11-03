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
  <article class="card surface">
    <div class="card-top">
      <span class="badge" :class="`status-${ticket.status.toLowerCase()}`">
        {{ ticket.status.replace('_', ' ') }}
      </span>
      <span class="priority" :class="`priority-${ticket.priority.toLowerCase()}`">
        {{ ticket.priority }}
      </span>
    </div>
    <h2>{{ props.ticket.title }}</h2>
    <p class="muted">
      {{ ticket.categoryPath }}<template v-if="ticket.area"> · {{ ticket.area }}</template>
    </p>
    <div class="card-foot">
      <span class="muted">#{{ ticket.id }}</span>
      <button class="btn btn-small" type="button" @click="emit('open', ticket.id)">Open</button>
    </div>
  </article>
</template>

<style scoped>
.card {
  padding: var(--space-4) var(--space-5);
  margin-bottom: var(--space-3);
  transition:
    box-shadow 0.15s,
    border-color 0.15s;
}

.card:hover {
  border-color: var(--color-line-strong);
  box-shadow: var(--shadow);
}

.card-top,
.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.card-foot {
  margin-top: var(--space-3);
}

h2 {
  margin: var(--space-3) 0 var(--space-1);
  font-size: 16px;
  font-weight: 600;
}
</style>
