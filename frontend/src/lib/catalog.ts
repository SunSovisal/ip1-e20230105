import type { CatalogNode, CatalogOption } from '@/types/catalog'

export function catalogPath(id: number, nodes: CatalogNode[]): string {
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const names: string[] = []
  const seen = new Set<number>()
  let current = byId.get(id)
  while (current && !seen.has(current.id)) {
    seen.add(current.id)
    names.unshift(current.name)
    current = current.parentId == null ? undefined : byId.get(current.parentId)
  }
  return names.join(' / ')
}

export function catalogOptions(nodes: CatalogNode[]): CatalogOption[] {
  return nodes.map((node) => {
    const path = catalogPath(node.id, nodes)
    return { id: node.id, label: node.active ? path : `${path} (inactive)` }
  })
}

export function categoryIdForPath(path: string, nodes: CatalogNode[]): number | null {
  const match = nodes.find((node) => catalogPath(node.id, nodes) === path)
  return match?.id ?? null
}

export function categoryAndDescendantIds(categoryId: number, nodes: CatalogNode[]): Set<number> {
  const ids = new Set<number>()
  const queue = [categoryId]
  while (queue.length > 0) {
    const id = queue.pop()
    if (id == null || ids.has(id)) continue
    ids.add(id)
    for (const node of nodes) {
      if (node.parentId === id) queue.push(node.id)
    }
  }
  return ids
}
