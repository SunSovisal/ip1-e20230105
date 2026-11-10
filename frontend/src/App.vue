<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppShell from './components/AppShell.vue'
import { useAuthStore } from './stores/auth.ts'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const { currentUser } = storeToRefs(auth)
const router = useRouter()

function signOut() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <AppShell v-if="currentUser" :user="currentUser" @sign-out="signOut">
    <RouterView />
  </AppShell>
  <RouterView v-else />
</template>

<style scoped></style>
