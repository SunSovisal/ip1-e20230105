<script setup lang="ts">
import CommentItem from '@/components/CommentItem.vue'
import { comment as sampleComments } from '@/mock/comments'
import { tickets } from '@/mock/tickets'

const ticket = tickets.find((item) => item.id === 1)
const comments = sampleComments.filter((item) => item.ticketId === 1)
</script>

<template>
  <main>
    <p v-if="!ticket">Ticket not found.</p>
    <template v-else>
      <h1>{{ ticket.title }}</h1>
      <p>{{ ticket.status }} {{ ticket.priority }}</p>
      <p>{{ ticket.categoryPath }}</p>
      <p v-if="ticket.area">{{ ticket.area }}</p>
      <p>{{ ticket.description }}</p>

      <h2>Comments</h2>
      <p v-if="comments.length === 0">No comments yet.</p>
      <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" />
    </template>
  </main>
</template>

<style scoped>
main {
  max-width: 640px;
  margin: 24px;
  font-family: sans-serif;
}
h1 {
  font-size: 24px;
}
h2 {
  font-size: 18px;
  margin-top: 24px;
}
</style>
