import { catalogPath } from '@/lib/catalog'
import type { CatalogNode } from '@/types/catalog'

export const categoryNodes: CatalogNode[] = [
  { id: 1, name: 'Hardware', parentId: null, active: true },
  { id: 2, name: 'Desktop', parentId: 1, active: true },
  { id: 3, name: 'Laptop', parentId: 1, active: true },
  { id: 4, name: 'Peripherals', parentId: 1, active: true },
  { id: 5, name: 'Network', parentId: 1, active: true },
  { id: 6, name: 'Software', parentId: null, active: true },
  { id: 7, name: 'Account access', parentId: 6, active: true },
]

export const categories: string[] = categoryNodes
  .filter((node) => node.active && node.parentId !== null)
  .map((node) => catalogPath(node.id, categoryNodes))
