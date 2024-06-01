<script lang="ts">
import { computed, defineComponent, inject, provide, ref, toRef } from 'vue'
import type { PropType, Ref } from 'vue'
import { useMeiUI } from '../../composables/use-mei-ui'
import { mergeConfig } from '../../utils'
import type {
  FormError,
  FormGroupSize,
  InjectedFormGroupValue,
  Strategy,
} from '../../types'
// @ts-expect-error - no types available
import appConfig from '#build/app.config'
import { formGroup } from '#mei-ui/ui-configs'
import { useId } from '#imports'

const config = mergeConfig<typeof formGroup>(
  appConfig.meiUI.strategy,
  appConfig.meiUI.formGroup,
  formGroup,
)

export default defineComponent({
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: null,
    },
    size: {
      type: String as PropType<FormGroupSize>,
      default: null,
      validator(value: string) {
        return Object.keys(config.size).includes(value)
      },
    },
    label: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    help: {
      type: String,
      default: null,
    },
    error: {
      type: [String, Boolean],
      default: null,
    },
    hint: {
      type: String,
      default: null,
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
    eagerValidation: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { ui, attrs } = useMeiUI(
      'formGroup',
      toRef(props, 'ui'),
      config,
      toRef(props, 'class'),
    )

    const formErrors = inject<Ref<FormError[]> | null>('form-errors', null)

    const error = computed(() => {
      return (props.error && typeof props.error === 'string')
        || typeof props.error === 'boolean'
        ? props.error
        : formErrors?.value?.find(error => error.path === props.name)
          ?.message
    })

    const size = computed(
      () => ui.value.size[props.size ?? config.default.size],
    )
    const inputId = ref(useId())

    provide<InjectedFormGroupValue>('form-group', {
      error,
      inputId,
      name: computed(() => props.name),
      size: computed(() => props.size),
      eagerValidation: computed(() => props.eagerValidation),
    })

    return {

      ui,
      attrs,
      inputId,

      size,

      error,
    }
  },
})
</script>

<template>
  <div
    :class="ui.wrapper"
    v-bind="attrs"
  >
    <div :class="ui.inner">
      <div
        v-if="label || $slots.label"
        :class="[ui.label.wrapper, size]"
      >
        <label
          :for="inputId"
          :class="[ui.label.base, required ? ui.label.required : '']"
        >
          <slot
            v-if="$slots.label"
            name="label"
            v-bind="{ error, label, name, hint, description, help }"
          />
          <template v-else>{{ label }}</template>
        </label>
        <span
          v-if="hint || $slots.hint"
          :class="[ui.hint]"
        >
          <slot
            v-if="$slots.hint"
            name="hint"
            v-bind="{ error, label, name, hint, description, help }"
          />
          <template v-else>{{ hint }}</template>
        </span>
      </div>

      <p
        v-if="description || $slots.description"
        :class="[ui.description, size]"
      >
        <slot
          v-if="$slots.description"
          name="description"
          v-bind="{ error, label, name, hint, description, help }"
        />
        <template v-else>
          {{ description }}
        </template>
      </p>
    </div>

    <div :class="[label ? ui.container : '']">
      <slot v-bind="{ error }" />

      <p
        v-if="(typeof error === 'string' && error) || $slots.error"
        :class="[ui.error, size]"
      >
        <slot
          v-if="$slots.error"
          name="error"
          v-bind="{ error, label, name, hint, description, help }"
        />
        <template v-else>
          {{ error }}
        </template>
      </p>
      <p
        v-else-if="help || $slots.help"
        :class="[ui.help, size]"
      >
        <slot
          v-if="$slots.help"
          name="help"
          v-bind="{ error, label, name, hint, description, help }"
        />
        <template v-else>
          {{ help }}
        </template>
      </p>
    </div>
  </div>
</template>
