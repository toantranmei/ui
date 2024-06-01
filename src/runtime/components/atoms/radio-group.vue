<script lang="ts">
import { computed, defineComponent, provide, toRef } from 'vue'
import type { PropType } from 'vue'
import { useMeiUI } from '../../composables/use-mei-ui'
import { useFormGroup } from '../../composables/use-form-group'
import { get, mergeConfig } from '../../utils'
import type { Strategy } from '../../types'
import URadio from './radio.vue'
// @ts-expect-error - no types available
import appConfig from '#build/app.config'

import { radio, radioGroup } from '#mei-ui/ui-configs'
import type colors from '#mei-ui-colors'

const config = mergeConfig<typeof radioGroup>(
  appConfig.meiUI.strategy,
  appConfig.meiUI.radioGroup,
  radioGroup,
)
const configRadio = mergeConfig<typeof radio>(
  appConfig.meiUI.strategy,
  appConfig.meiUI.radio,
  radio,
)

export default defineComponent({
  components: {
    URadio,
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Object],
      default: '',
    },
    name: {
      type: String,
      default: null,
    },
    legend: {
      type: String,
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
    },
    optionAttribute: {
      type: String,
      default: 'label',
    },
    valueAttribute: {
      type: String,
      default: 'value',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String as PropType<(typeof colors)[number]>,
      default: () => config.default.color,
      validator(value: string) {
        return appConfig.meiUI.colors.includes(value)
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
    uiRadio: {
      type: Object as PropType<
        Partial<typeof configRadio> & { strategy?: Strategy }
      >,
      default: () => ({}),
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const { ui, attrs } = useMeiUI(
      'radioGroup',
      toRef(props, 'ui'),
      config,
      toRef(props, 'class'),
    )
    const { ui: uiRadio } = useMeiUI(
      'radio',
      toRef(props, 'uiRadio'),
      configRadio,
    )

    const { emitFormChange, color, name } = useFormGroup(props, config)
    provide('radio-group', { color, name })

    const onUpdate = (value: any) => {
      emit('update:modelValue', value)
      emit('change', value)
      emitFormChange()
    }

    const guessOptionValue = (option: any) => {
      return get(
        option,
        props.valueAttribute,
        get(option, props.optionAttribute),
      )
    }

    const guessOptionText = (option: any) => {
      return get(
        option,
        props.optionAttribute,
        get(option, props.valueAttribute),
      )
    }

    const normalizeOption = (option: any) => {
      if (['string', 'number', 'boolean'].includes(typeof option)) {
        return {
          value: option,
          label: option,
        }
      }

      return {
        ...option,
        value: guessOptionValue(option),
        label: guessOptionText(option),
      }
    }

    const normalizedOptions = computed(() => {
      return props.options.map(option => normalizeOption(option))
    })

    return {

      ui,

      uiRadio,
      attrs,
      normalizedOptions,

      onUpdate,
    }
  },
})
</script>

<template>
  <div :class="ui.wrapper">
    <fieldset
      v-bind="attrs"
      :class="ui.fieldset"
    >
      <legend
        v-if="legend || $slots.legend"
        :class="ui.legend"
      >
        <slot name="legend">
          {{ legend }}
        </slot>
      </legend>
      <URadio
        v-for="option in normalizedOptions"
        :key="option.value"
        :label="option.label"
        :model-value="modelValue"
        :value="option.value"
        :help="option.help"
        :disabled="option.disabled || disabled"
        :ui="uiRadio"
        @change="onUpdate(option.value)"
      >
        <template #label>
          <slot
            name="label"
            v-bind="{ option }"
          />
        </template>
      </URadio>
    </fieldset>
  </div>
</template>
