<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string;
    width?: string;
    height?: string;
    placeholder?: [number, number];
  }>(),
  {
    width: "100%",
    height: "auto",
    placeholder: () => [30, 20],
  },
);
</script>

<template>
  <NuxtImg
    src="/images/mountains_1.jpg"
    :placeholder="placeholder"
    :width="width"
    :height="height"
  />
</template>
