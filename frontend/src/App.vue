<script setup lang="ts">
import TicketListView from './views/TicketListView.vue'
import TicketDetailView from './views/TicketDetailView.vue'
import AppShell from './components/AppShell.vue'

const user = { name: 'Sun Sovann', role: 'REQUESTER' as const }
</script>

<template>
  <AppShell :user="user">
    <RouterView />
  </AppShell>
</template>

<style scoped></style>
