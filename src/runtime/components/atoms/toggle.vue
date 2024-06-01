<script lang="ts">
import { computed, defineComponent, toRef } from 'vue'
import type { PropType } from 'vue'
import { Switch as HSwitch, provideUseId } from '@headlessui/vue'
import { twJoin, twMerge } from 'tailwind-merge'
import { useMeiUI } from '../../composables/use-mei-ui'

import { useFormGroup } from '../../composables/use-form-group'
import { mergeConfig } from '../../utils'
import type { Strategy, ToggleColor, ToggleSize } from '../../types'
import MeiIcon from './icon.vue'
// @ts-expect-error - no types available
import appConfig from '#build/app.config'

import { toggle } from '#mei-ui/ui-configs'
import { useId } from '#imports'

const config = mergeConfig<typeof toggle>(
  appConfig.meiUI.strategy,
  appConfig.meiUI.toggle,
  toggle,
)

export default defineComponent({
  components: {
    HSwitch,
    MeiIcon,
  },
  inheritAttrs: false,
  props: {
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    onIcon: {
      type: String,
      default: () => config.default.onIcon,
    },
    offIcon: {
      type: String,
      default: () => config.default.offIcon,
    },
    loadingIcon: {
      type: String,
      default: () => config.default.loadingIcon,
    },
    color: {
      type: String as PropType<ToggleColor>,
      default: () => config.default.color,
      validator(value: string) {
        return appConfig.meiUI.colors.includes(value)
      },
    },
    size: {
      type: String as PropType<ToggleSize>,
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
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const { ui, attrs } = useMeiUI('toggle', toRef(props, 'ui'), config)

    const { emitFormChange, color, inputId, name } = useFormGroup(props)

    const active = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
        emit('change', value)

        emitFormChange()
      },
    })

    const switchClass = computed(() => {
      return twMerge(
        twJoin(
          ui.value.base,
          ui.value.size[props.size],
          ui.value.rounded,
          color.value && ui.value.ring.replaceAll('{color}', color.value),
          color.value
          && (active.value ? ui.value.active : ui.value.inactive).replaceAll(
            '{color}',
            color.value,
          ),
        ),
        props.class,
      )
    })

    const containerClass = computed(() => {
      return twJoin(
        ui.value.container.base,
        ui.value.container.size[props.size],
        active.value
          ? ui.value.container.active[props.size]
          : ui.value.container.inactive,
      )
    })

    const onIconClass = computed(() => {
      return twJoin(
        ui.value.icon.size[props.size],
        color.value && ui.value.icon.on.replaceAll('{color}', color.value),
      )
    })

    const offIconClass = computed(() => {
      return twJoin(
        ui.value.icon.size[props.size],
        color.value && ui.value.icon.off.replaceAll('{color}', color.value),
      )
    })

    const loadingIconClass = computed(() => {
      return twJoin(
        ui.value.icon.size[props.size],
        color.value && ui.value.icon.loading.replaceAll('{color}', color.value),
      )
    })

    provideUseId(() => useId())

    return {

      ui,
      attrs,

      name,
      inputId,
      active,
      switchClass,
      containerClass,
      onIconClass,
      offIconClass,
      loadingIconClass,
    }
  },
})
</script>

<template>
  <HSwitch
    :id="inputId"
    v-model="active"
    :name="name"
    :disabled="disabled || loading"
    :class="switchClass"
    v-bind="attrs"
  >
    <span :class="containerClass">
      <span
        v-if="loading"
        :class="[ui.icon.active, ui.icon.base]"
        aria-hidden="true"
      >
        <MeiIcon
          :name="loadingIcon"
          :class="loadingIconClass"
        />
      </span>
      <span
        v-if="!loading && onIcon"
        :class="[active ? ui.icon.active : ui.icon.inactive, ui.icon.base]"
        aria-hidden="true"
      >
        <MeiIcon
          :name="onIcon"
          :class="onIconClass"
        />
      </span>
      <span
        v-if="!loading && offIcon"
        :class="[active ? ui.icon.inactive : ui.icon.active, ui.icon.base]"
        aria-hidden="true"
      >
        <MeiIcon
          :name="offIcon"
          :class="offIconClass"
        />
      </span>
    </span>
  </HSwitch>
</template>
