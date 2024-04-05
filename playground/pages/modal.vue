<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <div>
    <mei-button
      label="Open"
      @click="isOpen = true"
    />

    <mei-modal
      v-model="isOpen"
      fullscreen
    >
      aasas
    </mei-modal>
  </div>
</template>

