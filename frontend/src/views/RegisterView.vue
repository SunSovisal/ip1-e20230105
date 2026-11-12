<script setup lang="ts">
import logo from '@/assets/logo.png'
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
    <form class="surface auth-card" @submit.prevent="onSubmit">
      <p class="auth-brand"><img class="logo" :src="logo" alt="ITC" width="40" height="40" />Helpdesk</p>
      <div>
        <h1 class="page-title">Register</h1>
        <p class="muted">New accounts are requester accounts.</p>
      </div>
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
    <p class="auth-switch">
      Already registered? <RouterLink :to="{ name: 'login' }">Sign in</RouterLink>
    </p>
  </main>
</template>
