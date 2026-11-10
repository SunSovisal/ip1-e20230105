import { users as seedUsers } from '@/mock/users'
import type { Account, Role, User } from '@/types/user'

const USERS_KEY = 'helpdesk.users'
const SESSION_KEY = 'helpdesk.session'

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export class AuthError extends Error {}

function publicUser(account: Account): User {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
  }
}

function copySeed(): Account[] {
  return seedUsers.map((account) => ({ ...account }))
}

function readUsers(): Account[] {
  const saved = localStorage.getItem(USERS_KEY)
  if (!saved) {
    const fresh = copySeed()
    localStorage.setItem(USERS_KEY, JSON.stringify(fresh))
    return fresh
  }
  return JSON.parse(saved) as Account[]
}

function saveUsers(accounts: Account[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(accounts))
}

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export function readSession(): User | null {
  const saved = localStorage.getItem(SESSION_KEY)
  if (!saved) return null
  return JSON.parse(saved) as User
}

export async function login(email: string, password: string): Promise<User> {
  const account = readUsers().find(
    (item) => item.email === email.trim().toLowerCase() && item.password === password,
  )
  if (!account) throw new AuthError('Wrong email or password.')
  const user = publicUser(account)
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return delay(user)
}

export async function register(input: RegisterInput): Promise<User> {
  const accounts = readUsers()
  const email = input.email.trim().toLowerCase()
  if (accounts.some((item) => item.email === email)) {
    throw new AuthError('An account with this email already exists.')
  }
  const account: Account = {
    id: Math.max(...accounts.map((item) => item.id)) + 1,
    name: input.name.trim(),
    email,
    password: input.password,
    role: 'REQUESTER',
  }
  accounts.push(account)
  saveUsers(accounts)
  const user = publicUser(account)
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return delay(user)
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export async function setRole(userId: number, role: Role): Promise<User> {
  const accounts = readUsers()
  const account = accounts.find((item) => item.id === userId)
  if (!account) throw new AuthError('Account not found.')
  account.role = role
  saveUsers(accounts)
  return delay(publicUser(account))
}

export function listUsers(): User[] {
  return readUsers().map(publicUser)
}
export async function promoteToAgent(actor: User, userId: number): Promise<User> {
  if (actor.role !== 'ADMIN') throw new AuthError('Only an admin can change staff status.')
  if (actor.id === userId) throw new AuthError('You cannot change your own role.')
  const accounts = readUsers()
  const account = accounts.find((item) => item.id === userId)
  if (!account) throw new AuthError('Account not found.')
  if (account.role !== 'REQUESTER') throw new AuthError('Only a requester can be made an agent.')
  account.role = 'AGENT'
  saveUsers(accounts)
  return delay(publicUser(account))
}