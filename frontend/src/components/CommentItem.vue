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
    <p>{{ comment.body }}</p>
  </article>
</template>

<style scoped>
.comment {
  border-top: 1px solid var(--color-line);
  padding: var(--space-3) 0;
}

.meta {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
  font-size: 14px;
}
</style>
