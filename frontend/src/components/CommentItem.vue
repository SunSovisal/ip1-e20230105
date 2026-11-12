<script setup lang="ts">
import type { Comment } from '@/types/comment'

defineProps<{
  comment: Comment
}>()
</script>

<template>
  <article class="comment">
    <p class="meta">
      <strong>{{ comment.authorName }}</strong>
      <span class="muted">{{ comment.createdAt }}</span>
    </p>
    <p class="body">{{ comment.body }}</p>
  </article>
</template>

<style scoped>
.comment {
  border-top: 1px solid var(--color-line);
  padding: var(--space-4) 0 var(--space-3);
}

.comment:last-child {
  padding-bottom: 0;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
  font-size: 14px;
}

.body {
  max-width: 65ch;
  white-space: pre-line;
}
</style>
