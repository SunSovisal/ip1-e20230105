<script setup lang="ts">
import type { Comment } from '@/types/comment'

const props = defineProps<{
  comment: Comment
}>()
</script>

<template>
  <article class="comment">
    <p class="meta">{{ comment.authorName }} {{ comment.createdAt }}</p>
    <p>{{ comment.body }}</p>
  </article>
</template>

<style scoped>
.comment {
  border: 1px solid #111;
  padding: 12px 16px;
  margin-bottom: 12px;
}
.meta {
  margin: 0 0 8px;
  font-size: 14px;
}
p {
  margin: 0;
}
</style>
