<script lang="ts">
import { computed, defineComponent, toRef } from 'vue'
import type { PropType } from 'vue'
import { twJoin, twMerge } from 'tailwind-merge'
import { useMeiUI } from '../../composables/use-mei-ui'
import { mergeConfig } from '../../utils'
import type { Avatar, DividerSize, Strategy } from '../../types'
import MeiAvatar from './alert.vue'
import MeiIcon from './icon.vue'
// @ts-expect-error - no types available
import appConfig from '#build/app.config'
import { divider } from '#mei-ui/ui-configs'

const config = mergeConfig<typeof divider>(
  appConfig.meiUI.strategy,
  appConfig.meiUI.divider,
  divider,
)

export default defineComponent({
  components: {
    MeiIcon,
    MeiAvatar,
  },
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    avatar: {
      type: Object as PropType<Avatar>,
      default: null,
    },
    size: {
      type: String as PropType<DividerSize>,
      default: () => config.default.size,
      validator(value: string) {
        return (
          Object.keys(config.border.size.horizontal).includes(value)
          || Object.keys(config.border.size.vertical).includes(value)
        )
      },
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
      validator: (value: string) => ['horizontal', 'vertical'].includes(value),
    },
    type: {
      type: String as PropType<'solid' | 'dotted' | 'dashed'>,
      default: 'solid',
      validator: (value: string) =>
        ['solid', 'dotted', 'dashed'].includes(value),
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
    const { ui, attrs } = useMeiUI('divider', toRef(props, 'ui'), config)

    const wrapperClass = computed(() => {
      return twMerge(
        twJoin(ui.value.wrapper.base, ui.value.wrapper[props.orientation]),
        props.class,
      )
    })

    const containerClass = computed(() => {
      return twJoin(
        ui.value.container.base,
        ui.value.container[props.orientation],
      )
    })

    const borderClass = computed(() => {
      return twJoin(
        ui.value.border.base,
        ui.value.border[props.orientation],
        ui.value.border.size[props.orientation][props.size],
        ui.value.border.type[props.type],
      )
    })

    return {

      ui,
      attrs,
      wrapperClass,
      containerClass,
      borderClass,
    }
  },
})
</script>

<template>
  <div
    :class="wrapperClass"
    v-bind="attrs"
  >
    <div :class="borderClass" />

    <template v-if="label || icon || avatar || $slots.default">
      <div :class="containerClass">
        <slot>
          <span
            v-if="label"
            :class="ui.label"
          >
            {{ label }}
          </span>
          <MeiIcon
            v-else-if="icon"
            :name="icon"
            :class="ui.icon.base"
          />
          <MeiAvatar
            v-else-if="avatar"
            v-bind="{ size: ui.avatar.size, ...avatar }"
            :class="ui.avatar.base"
          />
        </slot>
      </div>

      <div :class="borderClass" />
    </template>
  </div>
</template>
