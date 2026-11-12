<script setup lang="ts">
import { catalogPath, catalogTreeRows } from '@/lib/catalog'
import type { CatalogNode } from '@/types/catalog'
import { computed, nextTick, ref, watch } from 'vue'

// One searchable tree picker for both catalogs.
// multiple: modelValue is a list of ids, shown as removable pills (tags).
// single: modelValue is one id or null, shown as text like a select (category).
// leafOnly: nodes with active children are group headings and cannot be picked.
const props = withDefaults(
  defineProps<{
    nodes: CatalogNode[]
    modelValue: number[] | number | null
    multiple?: boolean
    leafOnly?: boolean
    invalid?: boolean
    id?: string
    placeholder?: string
  }>(),
  { multiple: false, leafOnly: false, invalid: false, id: 'catalog-picker', placeholder: '' },
)

const emit = defineEmits<{ 'update:modelValue': [value: number[] | number | null] }>()

const query = ref('')
const open = ref(false)
const active = ref(0)
const input = ref<HTMLInputElement | null>(null)
const list = ref<HTMLUListElement | null>(null)

const listId = computed(() => `${props.id}-list`)

const rows = computed(() => {
  const activeNodes = props.nodes.filter((node) => node.active)
  const parents = new Set(activeNodes.map((node) => node.parentId))
  return catalogTreeRows(activeNodes).map(({ node, depth }) => ({
    id: node.id,
    name: node.name,
    path: catalogPath(node.id, props.nodes),
    depth,
    pickable: !props.leafOnly || !parents.has(node.id),
  }))
})

const pathById = computed(() => new Map(rows.value.map((row) => [row.id, row.path])))

const selectedIds = computed<number[]>(() => {
  const value = props.modelValue
  if (Array.isArray(value)) return value
  return value == null ? [] : [value]
})

const selected = computed(() =>
  selectedIds.value
    .filter((id) => pathById.value.has(id))
    .map((id) => ({ id, path: pathById.value.get(id)! })),
)

// Empty query: the whole tree, indented, with headings. Typing: matching pickable rows, flat, by full path.
const items = computed(() => {
  const text = query.value.trim().toLowerCase()
  if (!text) return rows.value.map((row) => ({ ...row, label: row.name }))
  return rows.value
    .filter((row) => row.pickable && row.path.toLowerCase().includes(text))
    .map((row) => ({ ...row, label: row.path, depth: 0 }))
})

// Indexes into items that the keyboard can land on.
const pickable = computed(() =>
  items.value.flatMap((item, index) => (item.pickable ? [index] : [])),
)

const activeIndex = computed(() => pickable.value[active.value] ?? -1)

const inputPlaceholder = computed(() => {
  if (props.multiple) return selected.value.length ? '' : props.placeholder
  return selected.value[0]?.path ?? props.placeholder
})

watch(items, () => {
  active.value = 0
})

function isSelected(id: number) {
  return selectedIds.value.includes(id)
}

function pick(id: number) {
  // Focus first: a focus event after close() would reopen the list.
  input.value?.focus()
  if (props.multiple) {
    const ids = selectedIds.value
    emit('update:modelValue', isSelected(id) ? ids.filter((value) => value !== id) : [...ids, id])
    query.value = ''
  } else {
    emit('update:modelValue', id)
    close()
  }
}

function remove(id: number) {
  emit(
    'update:modelValue',
    selectedIds.value.filter((value) => value !== id),
  )
  input.value?.focus()
}

function show() {
  if (open.value) return
  open.value = true
  // Single mode opens on the current choice.
  const current = pickable.value.findIndex((index) => isSelected(items.value[index]!.id))
  active.value = current >= 0 ? current : 0
  scrollToActive()
}

function close() {
  open.value = false
  query.value = ''
}

function scrollToActive() {
  nextTick(() => {
    const option = list.value?.querySelector<HTMLElement>(`#${CSS.escape(optionId(activeIndex.value))}`)
    option?.scrollIntoView?.({ block: 'nearest' })
  })
}

function move(step: number) {
  if (!open.value) {
    show()
    return
  }
  const count = pickable.value.length
  if (!count) return
  active.value = (active.value + step + count) % count
  scrollToActive()
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      move(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      move(-1)
      break
    case 'Enter': {
      // Enter never submits the form from here.
      event.preventDefault()
      const item = open.value ? items.value[activeIndex.value] : undefined
      if (item) pick(item.id)
      else show()
      break
    }
    case 'Escape':
      if (open.value) {
        event.preventDefault()
        close()
      }
      break
    case 'Backspace': {
      const last = selected.value[selected.value.length - 1]
      if (props.multiple && !query.value && last) remove(last.id)
      break
    }
  }
}

function onFocusOut(event: FocusEvent) {
  const root = event.currentTarget as HTMLElement
  if (!root.contains(event.relatedTarget as Node | null)) close()
}

function optionId(index: number) {
  return `${props.id}-option-${index}`
}
</script>

<template>
  <div class="picker" @focusout="onFocusOut">
    <div
      class="box"
      :class="{ single: !multiple, invalid, 'has-value': !multiple && selected.length }"
      @click="input?.focus(), show()"
    >
      <template v-if="multiple">
        <span v-for="item in selected" :key="item.id" class="chip">
          {{ item.path }}
          <button
            type="button"
            class="chip-remove"
            :aria-label="`Remove ${item.path}`"
            @click.stop="remove(item.id)"
          >
            ×
          </button>
        </span>
      </template>
      <input
        :id="id"
        ref="input"
        v-model="query"
        class="query"
        type="text"
        role="combobox"
        autocomplete="off"
        aria-autocomplete="list"
        :aria-expanded="open"
        :aria-controls="listId"
        :aria-invalid="invalid || undefined"
        :aria-activedescendant="open && activeIndex >= 0 ? optionId(activeIndex) : undefined"
        :placeholder="inputPlaceholder"
        @focus="show"
        @input="show"
        @keydown="onKeydown"
      />
      <svg v-if="!multiple" class="chevron" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
        <path
          d="M1 1l4 4 4-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <ul
      v-show="open"
      :id="listId"
      ref="list"
      class="menu"
      role="listbox"
      :aria-multiselectable="multiple || undefined"
    >
      <template v-for="(item, index) in items" :key="item.id">
        <li
          v-if="item.pickable"
          :id="optionId(index)"
          role="option"
          class="option"
          :class="{ active: index === activeIndex }"
          :aria-selected="isSelected(item.id)"
          :style="{ paddingLeft: `calc(var(--space-3) + ${item.depth} * var(--space-4))` }"
          @mousedown.prevent
          @mouseenter="active = pickable.indexOf(index)"
          @click="pick(item.id)"
        >
          <span>{{ item.label }}</span>
          <span v-if="isSelected(item.id)" class="check" aria-hidden="true">✓</span>
        </li>
        <li
          v-else
          role="presentation"
          class="heading"
          :style="{ paddingLeft: `calc(var(--space-3) + ${item.depth} * var(--space-4))` }"
          @mousedown.prevent
        >
          {{ item.label }}
        </li>
      </template>
      <li v-if="!pickable.length" class="empty muted">No matches for “{{ query }}”.</li>
    </ul>
  </div>
</template>

<style scoped>
.picker {
  position: relative;
}

.box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  padding: 3px 8px;
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-sm);
  background: var(--color-sheet);
  cursor: text;
}

.box.single {
  flex-wrap: nowrap;
  padding-right: 11px;
  cursor: pointer;
}

.box:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.box.invalid {
  border-color: var(--color-danger);
}

.box.invalid:focus-within {
  box-shadow: 0 0 0 1px var(--color-danger);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 4px 2px 10px;
  border: 1px solid var(--color-primary);
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 600;
}

.chip-remove {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}

.chip-remove:hover {
  background: var(--color-sheet);
}

.chip-remove:focus-visible {
  outline: 2px solid var(--color-primary);
}

.query {
  flex: 1;
  min-width: 120px;
  padding: 4px 2px;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
  color: inherit;
}

.single .query {
  min-width: 0;
  text-overflow: ellipsis;
  cursor: inherit;
}

.single .query:focus {
  cursor: text;
}

.query::placeholder {
  color: var(--color-placeholder);
}

/* In single mode the current choice is the placeholder, so it reads as the value. */
.has-value .query::placeholder {
  color: var(--color-ink);
}

.has-value .query:focus::placeholder {
  color: var(--color-muted);
}

.chevron {
  flex: none;
  color: var(--color-muted);
}

.menu {
  position: absolute;
  z-index: 10;
  top: calc(100% + 4px);
  left: 0;
  min-width: 100%;
  max-width: min(420px, 90vw);
  max-height: 240px;
  margin: 0;
  padding: 4px 0;
  overflow-y: auto;
  list-style: none;
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-sm);
  background: var(--color-sheet);
  box-shadow: var(--shadow);
}

.option {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 6px var(--space-3);
  white-space: nowrap;
  cursor: pointer;
}

.option.active {
  background: var(--color-soft);
}

.option[aria-selected='true'] {
  color: var(--color-primary);
  font-weight: 600;
}

.heading {
  padding: 8px var(--space-3) 2px;
  color: var(--color-muted);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  cursor: default;
}

.empty {
  padding: 6px var(--space-3);
}
</style>
