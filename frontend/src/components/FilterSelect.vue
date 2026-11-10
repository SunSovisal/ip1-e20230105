<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export interface FilterOption {
  value: string
  label: string
}

const props = defineProps<{
  id: string
  value: string
  options: FilterOption[]
}>()

const emit = defineEmits<{
  change: [value: string]
}>()

const root = ref<HTMLElement | null>(null)
const open = ref(false)
const activeIndex = ref(0)

const selectedLabel = computed(
  () => props.options.find((option) => option.value === props.value)?.label ?? 'Any',
)

const menuId = computed(() => `${props.id}-menu`)

function openMenu() {
  const selected = props.options.findIndex((option) => option.value === props.value)
  activeIndex.value = selected >= 0 ? selected : 0
  open.value = true
}

function closeMenu() {
  open.value = false
}

function toggle() {
  if (open.value) closeMenu()
  else openMenu()
}

function choose(value: string) {
  emit('change', value)
  closeMenu()
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMenu()
    return
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!open.value) {
      openMenu()
      return
    }
    const step = event.key === 'ArrowDown' ? 1 : -1
    activeIndex.value = (activeIndex.value + step + props.options.length) % props.options.length
    return
  }
  if ((event.key === 'Enter' || event.key === ' ') && open.value) {
    event.preventDefault()
    const option = props.options[activeIndex.value]
    if (option) choose(option.value)
  }
}

function onPointerDown(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) closeMenu()
}

onMounted(() => document.addEventListener('pointerdown', onPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown))
</script>

<template>
  <div ref="root" class="select">
    <button
      :id="id"
      class="trigger"
      type="button"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :aria-controls="menuId"
      @click="toggle"
      @keydown="onKey"
    >
      <span>{{ selectedLabel }}</span>
      <svg class="chevron" viewBox="0 0 12 8" aria-hidden="true">
        <path
          d="M1 1.5 6 6.5 11 1.5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <ul v-if="open" :id="menuId" class="menu" role="listbox">
      <li v-for="(option, index) in options" :key="option.value || 'any'" role="presentation">
        <button
          class="option"
          :class="{ selected: option.value === value, active: index === activeIndex }"
          type="button"
          role="option"
          :aria-selected="option.value === value"
          @mouseenter="activeIndex = index"
          @click="choose(option.value)"
        >
          {{ option.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.select {
  position: relative;
}

.trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  width: 100%;
  min-width: 0;
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-sm);
  background: var(--color-sheet);
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
}

.trigger span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trigger:focus-visible {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.chevron {
  width: 12px;
  height: 8px;
  flex: none;
  color: var(--color-muted);
}

.menu {
  position: absolute;
  z-index: 20;
  top: calc(100% + 4px);
  left: 0;
  width: max-content;
  min-width: 100%;
  margin: 0;
  padding: 4px;
  list-style: none;
  background: var(--color-sheet);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
  max-height: 240px;
  overflow: auto;
}

.option {
  display: block;
  width: 100%;
  border: 0;
  border-radius: 4px;
  background: transparent;
  padding: 6px 8px;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
}

.option.active {
  background: var(--color-soft);
}

.option.selected {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-weight: 600;
}
</style>
