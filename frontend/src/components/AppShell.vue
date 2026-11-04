<script setup lang="ts">
import { tickets } from '@/mock/tickets';

defineProps<{
  user: { name: string; role: 'REQUESTER' | 'AGENT' | 'ADMIN' }
}>()

const emit = defineEmits<{
  signOut: []
}>()
</script>

<template>
    <header class="topbar">
        <span class="brand">Helpdesk</span>
        <nav class="nav">
            <RouterLink :to=" { name: 'tickets' }">My tickets</RouterLink>
            <RouterLink :to=" { name: 'ticket-new'}">New ticket</RouterLink>
        </nav>
        <div class="user">
            <span class="muted">{{  user.name }} {{ user.role }}</span>
            <button class="btn btn-small" type="button" @click="emit('signOut')">Sign out</button>
        </div>
    </header>
    <slot />
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  height: 56px;
  padding: 0 var(--space-5);
  background: var(--color-sheet);
  border-bottom: 1px solid var(--color-line);
}
.brand {
  font-weight: 700;
  color: var(--color-primary);
}
.nav {
  display: flex;
  gap: var(--space-4);
  height: 100%;
}
.nav a {
  display: flex;
  align-items: center;
  color: var(--color-muted);
  text-decoration: none;
  border-bottom: 2px solid transparent;
}
.nav a.router-link-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: 600;
}
.user {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
</style>