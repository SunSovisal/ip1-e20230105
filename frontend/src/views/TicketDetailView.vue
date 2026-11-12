<script setup lang="ts">
import { fetchComments, fetchTicket } from '@/services/ticket'
import type { Comment } from '@/types/comment'
import CommentItem from '@/components/CommentItem.vue'
import type { Ticket } from '@/types/ticket'
import { catalogPath } from '@/lib/catalog'
import { priorityLabel, statusLabel } from '@/lib/labels'
import { tagNodes } from '@/mock/tags'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  id: string
}>()

const ticket = ref<Ticket | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const id = Number(props.id)
    ;[ticket.value, comments.value] = await Promise.all([fetchTicket(id), fetchComments(id)])
  } catch {
    error.value = 'Could not load this ticket.'
  } finally {
    loading.value = false
  }
}

const tagLabels = computed(() =>
  (ticket.value?.tagIds ?? []).map((id) => catalogPath(id, tagNodes)).filter(Boolean),
)

watch(() => props.id, load, { immediate: true })
</script>

<template>
  <main class="page detail">
    <RouterLink class="back" :to="{ name: 'tickets' }">← My tickets</RouterLink>
    <div v-if="loading" class="surface empty">Loading ticket…</div>
    <p v-else-if="error" class="banner banner-error">{{ error }}</p>
    <p v-else-if="!ticket" class="banner banner-error">Ticket not found.</p>
    <template v-else>
      <section class="surface panel">
        <p class="muted mono">#{{ ticket.id }}</p>
        <h1 class="page-title">{{ ticket.title }}</h1>
        <div class="badges">
          <span class="badge" :class="`status-${ticket.status.toLowerCase()}`">
            {{ statusLabel(ticket.status) }}
          </span>
          <span class="dot" aria-hidden="true">·</span>
          <span class="priority" :class="`priority-${ticket.priority.toLowerCase()}`">
            {{ priorityLabel(ticket.priority) }} priority
          </span>
        </div>
        <dl class="meta">
          <dt>Category</dt>
          <dd>{{ ticket.categoryPath }}</dd>
          <dt>Tags</dt>
          <dd>
            <template v-if="tagLabels.length">{{ tagLabels.join(', ') }}</template>
            <span v-else class="muted">None</span>
          </dd>
          <dt>Area</dt>
          <dd>
            <template v-if="ticket.area">{{ ticket.area }}</template>
            <span v-else class="muted">Not given</span>
          </dd>
          <dt>Assignee</dt>
          <dd>
            <template v-if="ticket.assigneeName">{{ ticket.assigneeName }}</template>
            <span v-else class="muted">Unassigned</span>
          </dd>
        </dl>
        <p class="prose">{{ ticket.description }}</p>
      </section>

      <section class="surface panel">
        <h2>
          Comments <span class="muted">{{ comments.length }}</span>
        </h2>
        <p v-if="comments.length === 0" class="muted none">No comments yet.</p>
        <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" />
      </section>
    </template>
  </main>
</template>

<style scoped>
.detail {
  max-width: 800px;
}

.back {
  display: inline-block;
  margin-bottom: var(--space-4);
  font-size: 14px;
  color: var(--color-muted);
  text-decoration: none;
}

.back:hover {
  color: var(--color-primary);
}

.panel {
  padding: var(--space-5);
  margin-bottom: var(--space-4);
}

.badges {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: var(--space-2) 0 var(--space-5);
}

.dot {
  color: var(--color-line-strong);
}

.meta {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: var(--space-2) var(--space-3);
  margin: 0 0 var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-line);
  font-size: 14px;
}

dt {
  color: var(--color-muted);
}

dd {
  margin: 0;
}

.prose {
  max-width: 65ch;
  white-space: pre-line;
}

h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: var(--space-2);
}

h2 .muted {
  font-weight: 400;
  margin-left: 4px;
}

.none {
  padding-top: var(--space-2);
}
</style>
