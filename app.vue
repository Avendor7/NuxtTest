<template>
  <div>
      <NuxtPage />
  </div>
</template>
<script>
</script>
<style>
nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
    text-decoration: none;
    color: var(--color-primary);
}

nav a:first-of-type {
    border: 0;
}

nav a:last-of-type {
    border: 0;
}

nav a.split {
    float: right;
}
</style>