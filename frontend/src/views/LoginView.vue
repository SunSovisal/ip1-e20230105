<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
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
    <form class="surface auth-card" @submit.prevent="onSubmit">
      <p class="auth-brand"><span class="mark" aria-hidden="true">H</span>Helpdesk</p>
      <div>
        <h1 class="page-title">Sign in</h1>
        <p class="muted">Use the email you registered with.</p>
      </div>
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
    <p class="auth-switch">No account? <RouterLink :to="{ name: 'register' }">Register</RouterLink></p>
  </main>
</template>
