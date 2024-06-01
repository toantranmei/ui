<script lang="ts">
import { computed, defineComponent, toRef } from 'vue'
import type { PropType } from 'vue'
import { twJoin, twMerge } from 'tailwind-merge'
import { useMeiUI } from '../../composables/use-mei-ui'

import { mergeConfig } from '../../utils'
import type { KbdSize, Strategy } from '../../types'
// @ts-expect-error - no types available
import appConfig from '#build/app.config'
import { kbd } from '#mei-ui/ui-configs'

const config = mergeConfig<typeof kbd>(
  appConfig.meiUI.strategy,
  appConfig.meiUI.kbd,
  kbd,
)

export default defineComponent({
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: null,
    },
    size: {
      type: String as PropType<KbdSize>,
      default: () => config.default.size,
      validator(value: string) {
        return Object.keys(config.size).includes(value)
      },
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => '',
    },
    ui: {
      type: Object as PropType<
        Partial<typeof config> & { strategy?: Strategy }
      >,
      default: () => ({}),
    },
  },
  setup(props) {
    const { ui, attrs } = useMeiUI('kbd', toRef(props, 'ui'), config)

    const kbdClass = computed(() => {
      return twMerge(
        twJoin(
          ui.value.base,
          ui.value.size[props.size],
          ui.value.padding,
          ui.value.rounded,
          ui.value.font,
          ui.value.background,
          ui.value.ring,
        ),
        props.class,
      )
    })

    return {

      ui,
      attrs,
      kbdClass,
    }
  },
})
</script>

<template>
  <kbd
    :class="kbdClass"
    v-bind="attrs"
  >
    <slot>{{ value }}</slot>
  </kbd>
</template>
