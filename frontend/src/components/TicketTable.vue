<script setup lang="ts">
import { priorityLabel, statusLabel } from '@/lib/labels'
import type { Ticket } from '@/types/ticket'

defineProps<{
  tickets: Ticket[]
  variant: 'mine' | 'inbox'
}>()

const emit = defineEmits<{
  open: [id: number]
}>()
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>Title</th>
        <th v-if="variant === 'inbox'">Requester</th>
        <th>Category</th>
        <th>Priority</th>
        <th>Status</th>
        <th>Assignee</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="ticket in tickets" :key="ticket.id" @click="emit('open', ticket.id)">
        <td>
          <button class="title-btn" type="button" @click.stop="emit('open', ticket.id)">
            {{ ticket.title }}
          </button>
          <div class="muted sub">
            <span class="mono">#{{ ticket.id }}</span
            ><template v-if="ticket.area"> · {{ ticket.area }}</template>
          </div>
        </td>
        <td v-if="variant === 'inbox'">
          <div>{{ ticket.requesterName }}</div>
          <div class="muted">{{ ticket.requesterEmail }}</div>
        </td>
        <td>{{ ticket.categoryPath }}</td>
        <td>
          <span class="priority" :class="`priority-${ticket.priority.toLowerCase()}`">
            {{ priorityLabel(ticket.priority) }}
          </span>
        </td>
        <td>
          <span class="badge" :class="`status-${ticket.status.toLowerCase()}`">
            {{ statusLabel(ticket.status) }}
          </span>
        </td>
        <td>
          <span v-if="ticket.assigneeName">{{ ticket.assigneeName }}</span>
          <span v-else class="muted">Unassigned</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.title-btn {
  border: 0;
  color: var(--color-ink);
  background: transparent;
  padding: 0;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

tr:hover .title-btn {
  color: var(--color-primary);
}

.sub {
  margin-top: 2px;
}

.title-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
