<template>
  <main class="page narrow">
    <div class="surface empty notfound">
      <p class="code mono">404</p>
      <p>This page does not exist.</p>
      <RouterLink class="btn btn-primary" :to="{ name: 'tickets' }">Back to my tickets</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.narrow {
  max-width: 560px;
}

.notfound {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
}

.code {
  font-size: 40px;
  color: var(--color-muted);
}
</style>