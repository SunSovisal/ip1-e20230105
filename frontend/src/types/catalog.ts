export interface CatalogNode {
  id: number
  name: string
  parentId: number | null
  active: boolean
}

export interface CatalogOption {
  id: number
  label: string
}
