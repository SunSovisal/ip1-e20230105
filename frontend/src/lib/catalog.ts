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

export interface CatalogTreeRow {
  node: CatalogNode
  depth: number
}

/** Nodes in tree order: each parent followed by its children, depth-first. */
export function catalogTreeRows(nodes: CatalogNode[]): CatalogTreeRow[] {
  const rows: CatalogTreeRow[] = []
  const seen = new Set<number>()
  const ids = new Set(nodes.map((node) => node.id))
  function visit(parentId: number | null, depth: number) {
    for (const node of nodes) {
      if (node.parentId !== parentId || seen.has(node.id)) continue
      seen.add(node.id)
      rows.push({ node, depth })
      visit(node.id, depth + 1)
    }
  }
  visit(null, 0)
  // Orphans whose parent is missing still show, at the top level.
  for (const node of nodes) {
    if (!seen.has(node.id) && (node.parentId == null || !ids.has(node.parentId))) {
      seen.add(node.id)
      rows.push({ node, depth: 0 })
      visit(node.id, 1)
    }
  }
  return rows
}
