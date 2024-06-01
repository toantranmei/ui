<script lang="ts">
import { computed, defineComponent, ref, toRef, watch } from 'vue'
import type { PropType } from 'vue'
import { twJoin, twMerge } from 'tailwind-merge'
import { useMeiUI } from '../../composables/use-mei-ui'
import { mergeConfig } from '../../utils'
import type {
  AvatarChipColor,
  AvatarChipPosition,
  AvatarSize,
  Strategy,
} from '../../types'
import MeiIcon from './icon.vue'
// @ts-expect-error - no types available
import appConfig from '#build/app.config'
import { avatar } from '#mei-ui/ui-configs'

const config = mergeConfig<typeof avatar>(
  appConfig.meiUI.strategy,
  appConfig.meiUI.avatar,
  avatar,
)

export default defineComponent({
  components: {
    MeiIcon,
  },
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object],
      default: 'img',
    },
    src: {
      type: [String, Boolean],
      default: null,
    },
    alt: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: () => config.default.icon,
    },
    size: {
      type: String as PropType<AvatarSize>,
      default: () => config.default.size,
      validator(value: string) {
        return Object.keys(config.size).includes(value)
      },
    },
    chipColor: {
      type: String as PropType<AvatarChipColor>,
      default: () => config.default.chipColor,
      validator(value: string) {
        return ['gray', ...appConfig.meiUI.colors].includes(value)
      },
    },
    chipPosition: {
      type: String as PropType<AvatarChipPosition>,
      default: () => config.default.chipPosition,
      validator(value: string) {
        return Object.keys(config.chip.position).includes(value)
      },
    },
    chipText: {
      type: [String, Number],
      default: null,
    },
    imgClass: {
      type: String,
      default: '',
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
    const { ui, attrs } = useMeiUI('avatar', toRef(props, 'ui'), config)
    const error = ref(false)

    const url = computed(() => {
      if (typeof props.src === 'boolean') {
        return null
      }
      return props.src
    })

    const placeholder = computed(() => {
      return (props.alt || '')
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 2)
    })

    const wrapperClass = computed(() => {
      return twMerge(
        twJoin(
          ui.value.wrapper,
          (error.value || !url.value) && ui.value.background,
          ui.value.rounded,
          ui.value.size[props.size],
        ),
        props.class,
      )
    })

    const imgClass = computed(() => {
      return twMerge(
        twJoin(ui.value.rounded, ui.value.size[props.size]),
        props.imgClass,
      )
    })

    const iconClass = computed(() => {
      return twJoin(ui.value.icon.base, ui.value.icon.size[props.size])
    })

    const chipClass = computed(() => {
      return twJoin(
        ui.value.chip.base,
        ui.value.chip.size[props.size],
        ui.value.chip.position[props.chipPosition],
        ui.value.chip.background.replaceAll('{color}', props.chipColor),
      )
    })

    watch(
      () => props.src,
      () => {
        if (error.value) {
          error.value = false
        }
      },
    )

    function onError() {
      error.value = true
    }

    return {

      ui,
      attrs,
      wrapperClass,

      imgClass,
      iconClass,
      chipClass,
      url,
      placeholder,
      error,
      onError,
    }
  },
})
</script>

<template>
  <span :class="wrapperClass">
    <component
      :is="as"
      v-if="url && !error"
      :class="imgClass"
      :alt="alt"
      :src="url"
      v-bind="attrs"
      @error="onError"
    />
    <span
      v-else-if="text"
      :class="ui.text"
    >{{ text }}</span>
    <MeiIcon
      v-else-if="icon"
      :name="icon"
      :class="iconClass"
    />
    <span
      v-else-if="placeholder"
      :class="ui.placeholder"
    >{{
      placeholder
    }}</span>

    <span
      v-if="chipColor"
      :class="chipClass"
    >
      {{ chipText }}
    </span>
    <slot />
  </span>
</template>
