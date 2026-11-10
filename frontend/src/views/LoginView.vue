<script setup lang="ts">
import { tickets } from '@/mock/tickets'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const submitting = ref(false)

onMounted(() => {
  auth.error = ''
})

async function onSubmit() {
  submitting.value = true
  try {
    await auth.login(email.value, password.value)
    await router.push({ name: 'tickets' })
  } catch {
  } finally {
    submitting.value = false
  }
}
</script>


<template>
  <main class="auth-page">
    <p class="brand">Helpdesk</p>
    <form class="surface card" @submit.prevent="onSubmit">
      <h1 class="page-title">Sign in</h1>
      <p v-if="auth.error" class="banner banner-error">{{ auth.error }}</p>
      <label class="field">
        <span class="label">Email</span>
        <input v-model="email" class="input" type="email" autocomplete="username" required />
      </label>
      <label class="field">
        <span class="label">Password</span>
        <input
          v-model="password"
          class="input"
          type="password"
          autocomplete="current-password"
          required
        />
      </label>
      <button class="btn btn-primary" type="submit" :disabled="submitting">Sign in</button>
    </form>
    <p class="switch">No account? <RouterLink :to="{ name: 'register' }">Register</RouterLink></p>
  </main>
</template>
<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-4);
}
.brand {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary);
}
.card {
  width: min(420px, 100%);
  padding: var(--space-6);
  display: grid;
  gap: var(--space-4);
}
.card .btn-primary {
  width: 100%;
  justify-content: center;
}
.switch {
  font-size: 14px;
}
</style>