<script setup lang="ts">
const toast = useToast();
</script>

<template>
  <MeiButton
    label="Show toast"
    @click="toast.add({ title: 'Hello world!' })"
  />
</template>
