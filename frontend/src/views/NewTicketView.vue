<script setup lang="ts">
import { catalogTreeRows } from '@/lib/catalog'
import { categories } from '@/mock/categories'
import { tagNodes } from '@/mock/tags'
import { useTicketStore } from '@/stores/tickets'
import type { TicketPriority } from '@/types/ticket'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

type Field = 'title' | 'description' | 'categoryPath' | 'area' | 'image'

const tags = catalogTreeRows(tagNodes.filter((node) => node.active)).map(({ node, depth }) => ({
  id: node.id,
  label: node.name,
  depth,
}))

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
          :class="{ invalid: errors.description }"
        />
        <p class="muted">What happened, what you expected, and what you already tried.</p>
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
        <label class="label" for="category">Category</label>
        <select
          id="category"
          v-model="draft.categoryPath"
          class="input"
          :class="{ invalid: errors.categoryPath }"
        >
          <option value="" disabled>Choose a category</option>
          <option v-for="path in categories" :key="path" :value="path">{{ path }}</option>
        </select>
        <p v-if="errors.categoryPath" class="field-error">{{ errors.categoryPath }}</p>
      </div>
      <fieldset class="field plain">
        <legend class="label">Tags <span class="muted">(optional)</span></legend>
        <div class="tags">
          <label
            v-for="tag in tags"
            :key="tag.id"
            class="check"
            :style="{ paddingLeft: `calc(${tag.depth} * var(--space-5))` }"
          >
            <input v-model="draft.tagIds" type="checkbox" :value="tag.id" />
            <span>{{ tag.label }}</span>
          </label>
        </div>
      </fieldset>
      <div class="field">
        <label class="label" for="image">Screenshot <span class="muted">(optional)</span></label>
        <div class="file">
          <button class="btn btn-small" type="button" @click="pickImage">Choose file</button>
          <span class="muted">{{ imageName || 'No file chosen' }}</span>
          <input
            id="image"
            ref="imageInput"
            class="file-input"
            type="file"
            accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
            @change="onImage"
          />
        </div>
        <p class="muted">PNG, JPG, or WebP, up to 2 MB. The prototype checks the file but does not upload it yet.</p>
        <p v-if="errors.image" class="field-error">{{ errors.image }}</p>
      </div>
      <div class="actions">
        <RouterLink class="btn" :to="{ name: 'tickets' }">Cancel</RouterLink>
        <button class="btn btn-primary" type="submit" :disabled="submitting">
          {{ submitting ? 'Creating…' : 'Create ticket' }}
        </button>
      </div>
    </form>
  </main>
</template>

<style scoped>
.form {
  display: grid;
  gap: var(--space-5);
  max-width: 720px;
  padding: var(--space-5);
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
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
  min-height: 140px;
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

.tags {
  display: grid;
  gap: 6px;
}

.check {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: fit-content;
  cursor: pointer;
}

.check input {
  accent-color: var(--color-primary);
}

.file {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.file:focus-within .btn {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.file-input {
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
  justify-content: flex-end;
  gap: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-line);
}

@media (max-width: 560px) {
  .row {
    grid-template-columns: 1fr;
  }
}
</style>
