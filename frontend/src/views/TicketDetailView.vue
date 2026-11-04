<script setup lang="ts">
import { fetchComments, fetchTicket } from '@/services/ticket'
import type { Comment } from '@/types/comment'
import CommentItem from '@/components/CommentItem.vue'
import type { Ticket } from '@/types/ticket'
import { ref, watch } from 'vue'

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
    error.value = 'Could not load this tickets'
  } finally {
    loading.value = false
  }
}

watch(() => props.id, load, { immediate: true })
</script>

<template>
  <main class="page">
    <div v-if="loading" class="surface empty">Loading ticket…</div>
    <p v-else-if="error" class="banner banner-error">{{ error }}</p>
    <p v-else-if="!ticket" class="banner banner-error">Ticket not found.</p>
    <template v-else>
      <section class="surface panel">
        <p class="muted">#{{ ticket.id }}</p>
        <h1 class="page-title">{{ ticket.title }}</h1>
        <div class="badges">
          <span class="badge" :class="`status-${ticket.status.toLowerCase()}`">
            {{ ticket.status.replace('_', ' ') }}
          </span>
          <span class="priority" :class="`priority-${ticket.priority.toLowerCase()}`">
            {{ ticket.priority }}
          </span>
        </div>
        <dl class="meta">
          <dt>Category</dt>
          <dd>{{ ticket.categoryPath }}</dd>
          <template v-if="ticket.area">
            <dt>Area</dt>
            <dd>{{ ticket.area }}</dd>
          </template>
        </dl>
        <p class="prose">{{ ticket.description }}</p>
      </section>

      <section class="surface panel">
        <h2>Comments</h2>
        <p v-if="comments.length === 0" class="muted">No comments yet.</p>
        <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" />
      </section>
    </template>
  </main>
</template>

<style scoped>
.panel {
  padding: var(--space-5);
  margin-bottom: var(--space-4);
}

.badges {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: var(--space-3) 0 var(--space-4);
}

.meta {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: var(--space-2) var(--space-3);
  margin: 0 0 var(--space-4);
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
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-line);
}

h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: var(--space-2);
}
</style>
