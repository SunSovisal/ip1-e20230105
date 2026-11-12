<script setup lang="ts">
import logo from '@/assets/logo.png'
import { computed } from 'vue'

const props = defineProps<{
  user: { name: string; role: 'REQUESTER' | 'AGENT' | 'ADMIN' }
}>()

const emit = defineEmits<{
  signOut: []
}>()

const roleLabel = computed(() => {
  if (props.user.role === 'AGENT') return 'Agent'
  if (props.user.role === 'ADMIN') return 'Admin'
  return 'Requester'
})
</script>

<template>
  <header class="topbar">
    <RouterLink class="brand" :to="{ name: 'tickets' }">
      <img class="logo" :src="logo" alt="ITC" width="32" height="32" />
      Helpdesk
    </RouterLink>
    <nav class="nav">
      <RouterLink :to="{ name: 'tickets' }">My tickets</RouterLink>
      <RouterLink :to="{ name: 'ticket-new' }">New ticket</RouterLink>
      <RouterLink v-if="user.role === 'ADMIN'" :to="{ name: 'staff' }">Staff</RouterLink>
    </nav>
    <div class="user">
      <span class="who">
        {{ user.name }} <span class="role">{{ roleLabel }}</span>
      </span>
      <button class="signout" type="button" @click="emit('signOut')">Sign out</button>
    </div>
  </header>
  <slot />
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  height: 52px;
  padding: 0 var(--space-5);
  background: var(--color-bar);
  color: var(--color-bar-text);
  font-size: 14px;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: #fff;
  font-weight: 650;
  text-decoration: none;
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
}

.nav {
  display: flex;
  gap: var(--space-5);
  height: 100%;
}

.nav a {
  display: flex;
  align-items: center;
  color: var(--color-bar-text);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  padding-top: 2px;
}

.nav a:hover {
  color: #fff;
}

.nav a.router-link-exact-active {
  color: #fff;
  border-bottom-color: var(--color-bar-accent);
}

.user {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.role {
  margin-left: 4px;
  padding: 1px 6px;
  border: 1px solid var(--color-bar-line);
  border-radius: var(--radius-sm);
  font-size: 12px;
}

.signout {
  border: 0;
  background: none;
  padding: 0;
  color: var(--color-bar-text);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.signout:hover {
  color: #fff;
}

.brand:focus-visible,
.nav a:focus-visible,
.signout:focus-visible {
  outline: 2px solid var(--color-bar-accent);
  outline-offset: 2px;
}

@media (max-width: 720px) {
  .topbar {
    flex-wrap: wrap;
    height: auto;
    gap: 0 var(--space-4);
    padding: var(--space-2) var(--space-4) 0;
  }

  .nav {
    order: 3;
    width: 100%;
    height: 40px;
  }

  .who {
    display: none;
  }
}
</style>
