<script setup lang="ts">
import FilterSelect, { type FilterOption } from '@/components/FilterSelect.vue'
import { emptyTicketFilters, type TicketFilterValue } from '@/lib/ticketList'
import type { CatalogOption } from '@/types/catalog'
import { computed } from 'vue'

const statusOptions: FilterOption[] = [
  { value: '', label: 'Any' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
]

const priorityOptions: FilterOption[] = [
  { value: '', label: 'Any' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
]

const props = defineProps<{
  value: TicketFilterValue
  categories: CatalogOption[]
  tags: CatalogOption[]
  areas: string[]
}>()

const emit = defineEmits<{
  'update:value': [value: TicketFilterValue]
}>()

function update(patch: Partial<TicketFilterValue>) {
  emit('update:value', { ...props.value, ...patch })
}

function onSearch(event: Event) {
  update({ query: (event.target as HTMLInputElement).value })
}

function onArea(next: string) {
  update({ area: next })
}

function onStatus(next: string) {
  update({ status: next as TicketFilterValue['status'] })
}

function onPriority(next: string) {
  update({ priority: next as TicketFilterValue['priority'] })
}

function onId(key: 'categoryId' | 'tagId', next: string) {
  update({ [key]: next === '' ? null : Number(next) })
}

const categoryOptions = computed<FilterOption[]>(() => [
  { value: '', label: 'Any' },
  ...props.categories.map((category) => ({ value: String(category.id), label: category.label })),
])

const areaOptions = computed<FilterOption[]>(() => [
  { value: '', label: 'Any' },
  ...props.areas.map((area) => ({ value: area, label: area })),
])

const tagOptions = computed<FilterOption[]>(() => [
  { value: '', label: 'Any' },
  ...props.tags.map((tag) => ({ value: String(tag.id), label: tag.label })),
])

const hasActiveFilters = computed(() => {
  const current = props.value
  return (
    current.query.trim() !== '' ||
    current.status !== '' ||
    current.priority !== '' ||
    current.categoryId != null ||
    current.area !== '' ||
    current.tagId != null
  )
})

function clear() {
  emit('update:value', emptyTicketFilters())
}
</script>

<template>
  <div class="bar">
    <div class="filters">
      <div class="field search">
        <div class="search-head">
          <label class="label" for="ticket-search">Search title</label>
          <button class="btn-link" type="button" :disabled="!hasActiveFilters" @click="clear">
            Clear filters
          </button>
        </div>
        <input
          id="ticket-search"
          class="input"
          type="search"
          placeholder="e.g. printer"
          :value="value.query"
          @input="onSearch"
        />
      </div>
      <div class="field">
        <label class="label" for="ticket-status">Status</label>
        <FilterSelect
          id="ticket-status"
          :value="value.status"
          :options="statusOptions"
          @change="onStatus"
        />
      </div>
      <div class="field">
        <label class="label" for="ticket-priority">Priority</label>
        <FilterSelect
          id="ticket-priority"
          :value="value.priority"
          :options="priorityOptions"
          @change="onPriority"
        />
      </div>
      <div class="field">
        <label class="label" for="ticket-category">Category</label>
        <FilterSelect
          id="ticket-category"
          :value="value.categoryId == null ? '' : String(value.categoryId)"
          :options="categoryOptions"
          @change="onId('categoryId', $event)"
        />
      </div>
      <div class="field">
        <label class="label" for="ticket-area">Area</label>
        <FilterSelect
          id="ticket-area"
          :value="value.area"
          :options="areaOptions"
          @change="onArea"
        />
      </div>
      <div class="field">
        <label class="label" for="ticket-tag">Tag</label>
        <FilterSelect
          id="ticket-tag"
          :value="value.tagId == null ? '' : String(value.tagId)"
          :options="tagOptions"
          @change="onId('tagId', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bar {
  padding: var(--space-4);
  background: var(--color-paper);
  border-bottom: 1px solid var(--color-line);
  border-radius: var(--radius) var(--radius) 0 0;
}

.filters {
  display: grid;
  grid-template-columns:
    minmax(0, 1.4fr)
    minmax(0, 0.9fr)
    minmax(0, 0.9fr)
    minmax(0, 1.8fr)
    minmax(0, 0.9fr)
    minmax(0, 1.5fr);
  gap: var(--space-3);
}

.search-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2);
}

.field {
  min-width: 0;
}

@media (max-width: 720px) {
  .filters {
    grid-template-columns: 1fr 1fr;
  }

  .search {
    grid-column: 1 / -1;
  }
}
</style>
