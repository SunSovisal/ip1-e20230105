import type { CatalogNode } from '@/types/catalog'

export const tagNodes: CatalogNode[] = [
  { id: 1, name: 'Student', parentId: null, active: true },
  { id: 2, name: 'Faculty', parentId: null, active: true },
  { id: 3, name: 'Year 1', parentId: 1, active: true },
  { id: 4, name: 'Year 2', parentId: 1, active: true },
]
