<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  props: {
    as: {
      type: String,
      default: 'div',
    },
  },
})
</script>

<template>
  <component
    :is="as"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>
