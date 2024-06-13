<template>
  <span :class="badgeClass" v-bind="attrs">
    <slot>{{ label }}</slot>
  </span>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useMeiUI } from '../../composables/useMeiUI'
import { mergeConfig } from '../../utils'
import { useInjectButtonGroup } from '../../composables/useButtonGroup'
import type { BadgeColor, BadgeSize, BadgeVariant, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { badge } from '#mei-ui/ui.config'

const config = mergeConfig<typeof badge>(appConfig.meiUI.strategy, appConfig.meiUI.badge, badge)

export default defineComponent({
  inheritAttrs: false,
  props: {
    size: {
      type: String as PropType<BadgeSize>,
      default: () => config.default.size,
      validator (value: string) {
        return Object.keys(config.size).includes(value)
      }
    },
    color: {
      type: String as PropType<BadgeColor>,
      default: () => config.default.color,
      validator (value: string) {
        return [...appConfig.meiUI.colors, ...Object.keys(config.color)].includes(value)
      }
    },
    variant: {
      type: String as PropType<BadgeVariant>,
      default: () => config.default.variant,
      validator (value: string) {
        return [
          ...Object.keys(config.variant),
          ...Object.values(config.color).flatMap(value => Object.keys(value))
        ].includes(value)
      }
    },
    label: {
      type: [String, Number],
      default: null
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<Partial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  setup (props) {
    const { ui, attrs } = useMeiUI('badge', toRef(props, 'ui'), config)

    const { size, rounded } = useInjectButtonGroup({ ui, props })

    const badgeClass = computed(() => {
      const variant = ui.value.color?.[props.color as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return twMerge(twJoin(
        ui.value.base,
        ui.value.font,
        rounded.value,
        ui.value.size[size.value],
        variant?.replaceAll('{color}', props.color)
      ), props.class)
    })

    return {
      attrs,
      badgeClass
    }
  }
})
</script>
