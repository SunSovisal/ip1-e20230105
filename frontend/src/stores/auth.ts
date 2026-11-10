import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  AuthError,
  listUsers,
  login as loginRequest,
  logout as logoutRequest,
  promoteToAgent,
  readSession,
  register as registerRequest,
  setRole as setRoleRequest,
  type RegisterInput,
} from '@/services/auth'
import type { Role, User } from '@/types/user'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(readSession())
  const error = ref('')

  async function login(email: string, password: string) {
    error.value = ''
    try {
      currentUser.value = await loginRequest(email, password)
    } catch (err) {
      error.value = err instanceof AuthError ? err.message : 'Could not sign in.'
      throw err
    }
  }

  async function register(input: RegisterInput) {
    error.value = ''
    try {
      currentUser.value = await registerRequest(input)
    } catch (err) {
      error.value = err instanceof AuthError ? err.message : 'Could not register'
      throw err
    }
  }

  function logout() {
    logoutRequest()
    currentUser.value = null
  }

  function staff() {
    return listUsers()
  }

  async function promote(userId: number) {
    if (!currentUser.value) throw new AuthError('Sign in first.')
    return promoteToAgent(currentUser.value, userId)
  }
  return { currentUser, error, login, register, logout, staff, promote }
})
