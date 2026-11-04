<template>
  <main class="page">
    <div class="surface empty notfound">
      <p class="code">404</p>
      <p>This page does not exist.</p>
      <RouterLink class="btn btn-primary" :to="{ name: 'tickets' }">Back to my tickets</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.notfound {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
}

.code {
  font-size: 48px;
  font-weight: 700;
  color: var(--color-primary);
}
</style>