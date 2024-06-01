<script setup lang="ts">
const selected = ref(false)
</script>

<template>
  <div>
    toggle: <MeiToggle
      v-model="selected"
      color="primary"
    />
  </div>
</template>
