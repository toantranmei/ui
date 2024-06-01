<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <div>
    <MeiButton
      label="Open"
      @click="isOpen = true"
    />

    <MeiModal
      v-model="isOpen"
      fullscreen
    >
      aasas
    </MeiModal>
  </div>
</template>
