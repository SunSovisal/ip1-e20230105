<script setup lang="ts">
import { priorityLabel, statusLabel } from '@/lib/labels'
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
        {{ statusLabel(ticket.status) }}
      </span>
      <span class="priority" :class="`priority-${ticket.priority.toLowerCase()}`">
        {{ priorityLabel(ticket.priority) }}
      </span>
    </div>
    <h2>{{ props.ticket.title }}</h2>
    <p class="muted">{{ ticket.categoryPath }}</p>
    <div class="card-foot">
      <span class="muted">
        <span class="mono">#{{ ticket.id }}</span><template v-if="ticket.area"> · {{ ticket.area }}</template> ·
        {{ ticket.assigneeName || 'Unassigned' }}
      </span>
      <button class="btn btn-small" type="button" @click="emit('open', ticket.id)">Open</button>
    </div>
  </article>
</template>

<style scoped>
.card {
  padding: var(--space-4);
  margin-bottom: var(--space-2);
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
  margin: var(--space-2) 0 2px;
  font-size: 15px;
  font-weight: 600;
}
</style>
