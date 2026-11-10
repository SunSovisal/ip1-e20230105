import type { Account } from '@/types/user'

export const users: Account[] = [
  {
    id: 1,
    name: 'Sun Sovann',
    email: 'requester@helpdesk.test',
    password: 'requester123',
    role: 'REQUESTER',
  },
  {
    id: 2,
    name: 'Sun Sovisal',
    email: 'agent@helpdesk.test',
    password: 'agent123',
    role: 'AGENT',
  },
  {
    id: 3,
    name: 'Admin',
    email: 'admin@helpdesk.test',
    password: 'admin123',
    role: 'ADMIN',
  },
]
