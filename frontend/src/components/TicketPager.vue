<script setup lang="ts">
defineProps<{
  page: number
  pageCount: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()
</script>

<template>
  <div class="pager">
    <button
      class="btn btn-small"
      type="button"
      :disabled="page <= 1"
      @click="emit('change', page - 1)"
    >
      Previous
    </button>
    <span class="muted">Page {{ page }} of {{ pageCount }}</span>
    <button
      class="btn btn-small"
      type="button"
      :disabled="page >= pageCount"
      @click="emit('change', page + 1)"
    >
      Next
    </button>
  </div>
</template>

<style scoped>
.pager {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-3);
}
</style>
