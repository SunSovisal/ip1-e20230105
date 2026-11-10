<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const submitting = ref(false)

onMounted(() => {
  auth.error = ''
})

async function onSubmit() {
  submitting.value = true
  try {
    await auth.register({ name: name.value, email: email.value, password: password.value })
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
      <h1 class="page-title">Register</h1>
      <p v-if="auth.error" class="banner banner-error">{{ auth.error }}</p>
      <label class="field">
        <span class="label">Name</span>
        <input v-model="name" class="input" type="text" autocomplete="name" required />
      </label>
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
          autocomplete="new-password"
          required
        />
      </label>
      <button class="btn btn-primary" type="submit" :disabled="submitting">Create account</button>
    </form>
    <p class="switch">
      Already registered? <RouterLink :to="{ name: 'login' }">Sign in</RouterLink>
    </p>
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
