<script setup lang="ts">
const selected = ref(true);
</script>

<template>
  <MeiCheckbox
    v-model="selected"
    name="notifications"
    label="Notifications"
  />
</template>
