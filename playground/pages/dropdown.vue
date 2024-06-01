<script setup lang="ts">
const items = [
  [
    {
      label: 'Profile',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/739984?v=4',
      },
    },
  ],
]
</script>

<template>
  <div>
    dropdown:
    <MeiDropdown
      :items="items"
      mode="hover"
      :popper="{ placement: 'bottom-start' }"
    >
      <button
        color="white"
        label="Options"
        trailing-icon="i-heroicons-chevron-down-20-solid"
      >
        dopdown
      </button>
    </MeiDropdown>
  </div>
</template>
