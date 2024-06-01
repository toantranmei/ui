<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useAppConfig } from '#imports'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    dynamic: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const appConfig = useAppConfig()

    const dynamicComputed = computed(
      () => props.dynamic || appConfig.meiUI?.icons?.dynamic,
    )

    return {
      dynamicComputed,
    }
  },
})
</script>

<template>
  <Icon
    v-if="dynamicComputed"
    :name="name"
  />
  <span
    v-else
    :class="name"
  />
</template>
