<script setup lang="ts">
import CatalogPicker from '@/components/CatalogPicker.vue'
import { catalogPath, categoryIdForPath } from '@/lib/catalog'
import { categoryNodes } from '@/mock/categories'
import { tagNodes } from '@/mock/tags'
import { useTicketStore } from '@/stores/tickets'
import type { TicketPriority } from '@/types/ticket'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

type Field = 'title' | 'description' | 'categoryPath' | 'area' | 'image'

const priorities: { value: TicketPriority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
]

const router = useRouter()
const store = useTicketStore()

const draft = reactive({
  title: '',
  description: '',
  priority: 'MEDIUM' as TicketPriority,
  categoryPath: '',
  area: '',
  tagIds: [] as number[],
})

// The draft keeps the path the store expects; the picker works with ids.
const categoryId = computed<number | null>({
  get: () => (draft.categoryPath ? categoryIdForPath(draft.categoryPath, categoryNodes) : null),
  set: (id) => {
    draft.categoryPath = id == null ? '' : catalogPath(id, categoryNodes)
  },
})

const imageName = ref('')
const imageInvalid = ref(false)
const imageInput = ref<HTMLInputElement | null>(null)

const errors = ref<Partial<Record<Field, string>>>({})
const submitting = ref(false)
const serverError = ref('')

function validate() {
  const next: Partial<Record<Field, string>> = {}
  const title = draft.title.trim()
  const area = draft.area.trim()

  if (title.length < 3 || title.length > 120) next.title = 'Title must be 3 to 120 characters.'
  if (draft.description.trim().length < 10)
    next.description = 'Description must be at least 10 characters.'
  if (!draft.categoryPath) next.categoryPath = 'Choose a category.'
  if (area && (area.length < 2 || area.length > 80)) next.area = 'Area must be 2 to 80 characters.'
  if (imageName.value && imageInvalid.value) {
    next.image = 'Use one png, jpg, jpeg, or webp file of at most 2 MB.'
  }
  errors.value = next
  return Object.keys(next).length === 0
}

function pickImage() {
  imageInput.value?.click()
}

function onImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) {
    imageName.value = ''
    imageInvalid.value = false
    return
  }
  const allowed = ['image/png', 'image/jpeg', 'image/webp']
  imageName.value = file.name
  imageInvalid.value = !allowed.includes(file.type) || file.size > 2 * 1024 * 1024
}

async function onSubmit() {
  if (!validate()) return
  submitting.value = true
  serverError.value = ''
  try {
    const ticket = await store.addTicket({
      ...draft,
      title: draft.title.trim(),
      area: draft.area.trim(),
      tagIds: [...draft.tagIds],
    })
    router.push({
      name: 'ticket-detail',
      params: { id: ticket.id },
    })
  } catch {
    serverError.value = 'Could not create the ticket. Try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">New ticket</h1>
        <p class="muted">Say what is wrong and where. Staff will reply on the ticket.</p>
      </div>
    </div>
    <form class="surface form" novalidate @submit.prevent="onSubmit">
      <p v-if="serverError" class="banner banner-error">{{ serverError }}</p>
      <div class="field">
        <label class="label" for="title">Title</label>
        <input
          id="title"
          v-model="draft.title"
          class="input"
          placeholder="e.g. Projector in J609 shows no signal"
          :class="{ invalid: errors.title }"
        />
        <p v-if="errors.title" class="field-error">{{ errors.title }}</p>
      </div>
      <div class="field">
        <label class="label" for="description">Description</label>
        <textarea
          id="description"
          v-model="draft.description"
          class="input description"
          placeholder="What happened, what you expected, and what you already tried."
          :class="{ invalid: errors.description }"
        />
        <p v-if="errors.description" class="field-error">{{ errors.description }}</p>
      </div>
      <div class="row">
        <fieldset class="field plain">
          <legend class="label">Priority</legend>
          <div class="segmented">
            <label v-for="option in priorities" :key="option.value">
              <input v-model="draft.priority" type="radio" name="priority" :value="option.value" />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </fieldset>
        <div class="field">
          <label class="label" for="category">Category</label>
          <CatalogPicker
            id="category"
            v-model="categoryId"
            :nodes="categoryNodes"
            leaf-only
            :invalid="!!errors.categoryPath"
            placeholder="Choose a category"
          />
          <p v-if="errors.categoryPath" class="field-error">{{ errors.categoryPath }}</p>
        </div>
        <div class="field">
          <label class="label" for="area">Area <span class="muted">(optional)</span></label>
          <input
            id="area"
            v-model="draft.area"
            class="input"
            placeholder="e.g. J609"
            :class="{ invalid: errors.area }"
          />
          <p v-if="errors.area" class="field-error">{{ errors.area }}</p>
        </div>
      </div>
      <div class="field">
        <label class="label" for="tags">Tags <span class="muted">(optional)</span></label>
        <CatalogPicker
          id="tags"
          v-model="draft.tagIds"
          :nodes="tagNodes"
          multiple
          placeholder="Add tag…"
        />
      </div>
      <div class="actions">
        <div class="attach">
          <label class="visually-hidden" for="image">Screenshot (optional)</label>
          <button
            class="btn btn-small"
            type="button"
            title="PNG, JPG, or WebP, up to 2 MB"
            aria-describedby="image-hint"
            @click="pickImage"
          >
            Attach screenshot
          </button>
          <span id="image-hint" class="muted file-name">{{
            imageName || 'Optional · PNG, JPG, WebP, 2 MB'
          }}</span>
          <input
            id="image"
            ref="imageInput"
            class="visually-hidden"
            type="file"
            tabindex="-1"
            accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
            @change="onImage"
          />
          <p v-if="errors.image" class="field-error">{{ errors.image }}</p>
        </div>
        <div class="buttons">
          <RouterLink class="btn" :to="{ name: 'tickets' }">Cancel</RouterLink>
          <button class="btn btn-primary" type="submit" :disabled="submitting">
            {{ submitting ? 'Creating…' : 'Create ticket' }}
          </button>
        </div>
      </div>
    </form>
  </main>
</template>

<style scoped>
.form {
  display: grid;
  gap: var(--space-4);
  max-width: 720px;
  padding: var(--space-5);
}

.row {
  display: grid;
  grid-template-columns: auto minmax(0, 1.5fr) minmax(0, 1fr);
  gap: var(--space-4);
  align-items: start;
}

.plain {
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}

.plain legend {
  padding: 0;
  margin-bottom: 6px;
}

.description {
  min-height: 110px;
  resize: vertical;
}

.segmented {
  display: flex;
}

.segmented label {
  flex: 1;
}

.segmented input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.segmented span {
  display: block;
  padding: 7px 10px;
  border: 1px solid var(--color-line-strong);
  margin-left: -1px;
  text-align: center;
  background: var(--color-sheet);
  cursor: pointer;
}

.segmented label:first-child span {
  margin-left: 0;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
}

.segmented label:last-child span {
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.segmented input:checked + span {
  position: relative;
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: 600;
}

.segmented input:focus-visible + span {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  position: relative;
}

.attach {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-3);
  min-width: 0;
}

.attach .field-error {
  flex-basis: 100%;
  margin: 0;
}

.file-name {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 260px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-line);
}

.buttons {
  display: flex;
  gap: var(--space-2);
  margin-left: auto;
}

@media (max-width: 640px) {
  .row {
    grid-template-columns: 1fr;
  }
}
</style>
