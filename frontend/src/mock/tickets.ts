import type { Ticket } from '@/types/ticket'

export const tickets: Ticket[] = [
  {
    id: 1,
    title: 'Desktop will not boot',
    status: 'OPEN',
    priority: 'HIGH',
    categoryPath: 'Hardware / Desktop',
    description: 'The desktop in the lab stays on a black screen after the power button.',
    area: 'J609',
  },
  {
    id: 2,
    title: 'Cannot connect to campus Wi-Fi',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    categoryPath: 'Hardware / Network',
    description: 'The campus network asks for the password again and then fails.',
    area: 'J704',
  },
  {
    id: 3,
    title: 'Forgot my moodle passoword',
    status: 'RESOLVED',
    priority: 'LOW',
    categoryPath: 'Software / Account access',
    description: 'The Moodle sign-in rejects the current password.',
  },
]