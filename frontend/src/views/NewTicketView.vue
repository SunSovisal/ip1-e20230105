<script setup lang="ts">
import { catalogPath } from '@/lib/catalog'
import { categories } from '@/mock/categories'
import { tagNodes } from '@/mock/tags'
import { useTicketStore } from '@/stores/tickets'
import type { TicketPriority } from '@/types/ticket'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

type Field = 'title' | 'description' | 'categoryPath' | 'area' | 'image'

const tags = tagNodes
  .filter((node) => node.active)
  .map((node) => ({
    id: node.id,
    label: catalogPath(node.id, tagNodes),
    child: node.parentId != null,
  }))

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

  if (title.length < 3 || title.length > 120) next.title = 'Title muse be 3 to 120 characters.'
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
    <h1 class="page-title head">New ticket</h1>
    <form class="surface form" novalidate @submit.prevent="onSubmit">
      <p v-if="serverError" class="banner banner-error">{{ serverError }}</p>
      <div class="field">
        <label class="label" for="title">Title</label>
        <input id="title" v-model="draft.title" class="input" :class="{ invalid: errors.title }" />
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
        <p v-if="errors.description" class="field-error">{{ errors.description }}</p>
      </div>
      <div class="row">
        <div class="field">
          <label class="label" for="priority">Priority</label>
          <select id="priority" v-model="draft.priority" class="input">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div class="field">
          <label class="label" for="area">Area <span class="muted">(optional)</span></label>
          <input
            id="area"
            v-model="draft.area"
            class="input"
            placeholder="J609"
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
      <fieldset class="tags">
        <legend class="label">Tags</legend>
        <label v-for="tag in tags" :key="tag.id" class="check" :class="{ child: tag.child }">
          <input v-model="draft.tagIds" type="checkbox" :value="tag.id" />
          <span>{{ tag.label }}</span>
        </label>
      </fieldset>
      <div class="field">
        <label class="label" for="image">Error image <span class="muted">(optional)</span></label>
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
        <p class="muted hint">png, jpg, jpeg, or webp. At most 2 MB.</p>
        <p class="muted hint">To be implemented.</p>
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
.head {
  margin-bottom: var(--space-5);
}
.form {
  display: grid;
  gap: var(--space-4);
  max-width: 720px;
  padding: var(--space-5);
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
.description {
  min-height: 140px;
  resize: vertical;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}
.tags {
  margin: 0;
  padding: 0;
  border: 0;
  display: grid;
  gap: var(--space-2);
}
.check {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.check.child {
  padding-left: var(--space-5);
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
.hint {
  margin-top: var(--space-1);
}
</style>
