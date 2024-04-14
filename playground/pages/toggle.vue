<template>
  <div>
    toggle: <mei-toggle
      v-model="selected"
      color="primary"
    />
  </div>
</template>

<script setup lang="ts">
const selected = ref(false);
</script>
