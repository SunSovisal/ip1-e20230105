<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/user'
import { onMounted, ref } from 'vue'

const auth = useAuthStore()
const people = ref<User[]>([])
const error = ref('')

function roleLabel(role: User['role']) {
  if (role == 'AGENT') return 'Agent'
  if (role == 'ADMIN') return 'Admin'
  return 'Requester'
}

function load() {
  people.value = auth.staff()
}

onMounted(load)

async function makeAgent(userId: number) {
  error.value = ''
  try {
    await auth.promote(userId)
    load()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Could not update this account.'
  }
}
</script>

<template>
  <main class="page">
    <header class="heading">
      <h1 class="page-title">Staff</h1>
      <p class="muted">Change a requester into an agent.</p>
    </header>
    <p v-if="error" class="banner banner-error">{{ error }}</p>
    <div class="surface">
      <table class="table staff">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in people" :key="person.id">
            <td>{{ person.name }}</td>
            <td>{{ person.email }}</td>
            <td>{{ roleLabel(person.role) }}</td>
            <td>
              <button
                v-if="person.role === 'REQUESTER'"
                class="btn btn-small"
                type="button"
                @click="makeAgent(person.id)"
              >
                Make agent
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
<style scoped>
.heading {
  margin-bottom: var(--space-5);
}
.staff :deep(tbody tr) {
  cursor: default;
}
td:last-child {
  text-align: right;
}
</style>
