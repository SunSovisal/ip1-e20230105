<script setup lang="ts">
import TicketPager from '@/components/TicketPager.vue'
import TicketCard from '@/components/TicketCard.vue'
import TicketFilters from '@/components/TicketFilters.vue'
import TicketTable from '@/components/TicketTable.vue'
import { catalogOptions } from '@/lib/catalog'
import {
  emptyTicketFilters,
  matchesTicketFilters,
  pageCountFor,
  pageOf,
  TICKET_PAGE_SIZE,
  type TicketFilterValue,
} from '@/lib/ticketList'
import { categoryNodes } from '@/mock/categories'
import { tagNodes } from '@/mock/tags'
import { useTicketStore } from '@/stores/tickets'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const store = useTicketStore()
const { tickets, loading, error } = storeToRefs(store)
const router = useRouter()

const filters = ref<TicketFilterValue>(emptyTicketFilters())
const page = ref(1)

const categories = catalogOptions(categoryNodes)
const tags = catalogOptions(tagNodes)

const areas = computed(() => {
  const names = new Set<string>()
  for (const ticket of tickets.value) {
    if (ticket.area) names.add(ticket.area)
  }
  return [...names].sort((a, b) => a.localeCompare(b))
})

const filtered = computed(() =>
  tickets.value.filter((ticket) => matchesTicketFilters(ticket, filters.value, categoryNodes)),
)

const pageCount = computed(() => pageCountFor(filtered.value.length, TICKET_PAGE_SIZE))

const pageTickets = computed(() => pageOf(filtered.value, page.value, TICKET_PAGE_SIZE))

function onFilters(value: TicketFilterValue) {
  filters.value = value
  page.value = 1
}

function onPage(next: number) {
  page.value = next
}

function onOpen(id: number) {
  router.push({ name: 'ticket-detail', params: { id } })
}

onMounted(() => store.loadTickets())
</script>

<template>
  <main class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">My tickets</h1>
        <p v-if="!loading && !error" class="muted">
          {{ filtered.length }} {{ filtered.length === 1 ? 'ticket' : 'tickets' }}
          <template v-if="filtered.length !== tickets.length">of {{ tickets.length }}</template>
        </p>
      </div>
      <RouterLink class="btn btn-primary" :to="{ name: 'ticket-new' }">New ticket</RouterLink>
    </div>

    <div class="surface board">
      <TicketFilters
        :value="filters"
        :categories="categories"
        :tags="tags"
        :areas="areas"
        @update:value="onFilters"
      />

      <p v-if="error" class="banner banner-error inset">{{ error }}</p>
      <div v-else-if="loading" class="empty">Loading tickets…</div>
      <div v-else-if="filtered.length === 0" class="empty">No tickets match these filters.</div>
      <template v-else>
        <div class="table-wrap">
          <TicketTable :tickets="pageTickets" variant="mine" @open="onOpen" />
        </div>
        <div class="cards">
          <TicketCard
            v-for="ticket in pageTickets"
            :key="ticket.id"
            :ticket="ticket"
            @open="onOpen"
          />
        </div>
      </template>
    </div>

    <TicketPager v-if="!loading && !error" :page="page" :page-count="pageCount" @change="onPage" />
  </main>
</template>

<style scoped>
.inset {
  margin: var(--space-4);
}

.table-wrap {
  overflow-x: auto;
}

.cards {
  display: none;
}

@media (max-width: 720px) {
  .table-wrap {
    display: none;
  }

  .cards {
    display: block;
    padding: var(--space-3);
  }
}
</style>
