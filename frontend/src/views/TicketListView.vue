<script setup lang="ts">
import { ref } from 'vue';
import { tickets as sample } from '@/mock/tickets';
import TicketCard from '@/components/TicketCard.vue';

const tickets = ref(sample)
const message = ref('')

function onOpen(id: number) {
    message.value = `Opened ticket ${id}`
}

</script>

<template>
    <main>
        <h1>My tickets</h1>
        <p v-if="message">{{ message }}</p>
        <p v-if="tickets.length === 0"> No ticket yet.</p>
        <TicketCard v-for="ticket in tickets" :key="ticket.id" :ticket="ticket" @open="onOpen"/>
    </main>
</template>

<style scoped>
main {
  max-width: 640px;
  margin: 24px;
  font-family: sans-serif;
}
h1 {
  font-size: 24px;
}
</style>