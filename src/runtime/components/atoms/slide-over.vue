<script lang="ts">
import { computed, defineComponent, toRef } from 'vue'
import type { PropType, WritableComputedRef } from 'vue'
import {
  Dialog as HDialog,
  DialogPanel as HDialogPanel,
  TransitionChild,
  TransitionRoot,
  provideUseId,
} from '@headlessui/vue'
import { useMeiUI } from '../../composables/use-mei-ui'
import { mergeConfig } from '../../utils'
import type { Strategy } from '../../types'
// @ts-expect-error - no types available
import appConfig from '#build/app.config'
import { slideOver } from '#mei-ui/ui-configs'
import { useId } from '#imports'

const config = mergeConfig<typeof slideOver>(
  appConfig.meiUI.strategy,
  appConfig.meiUI.slideover,
  slideOver,
)

export default defineComponent({
  components: {
    HDialog,
    HDialogPanel,
    TransitionRoot,
    TransitionChild,
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    appear: {
      type: Boolean,
      default: false,
    },
    side: {
      type: String as PropType<'left' | 'right' | 'bottom' | 'top'>,
      default: 'right',
      validator: (value: string) =>
        ['left', 'right', 'bottom', 'top'].includes(value),
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    transition: {
      type: Boolean,
      default: true,
    },
    preventClose: {
      type: Boolean,
      default: false,
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
  emits: ['update:modelValue', 'close', 'closePrevented', 'afterLeave'],
  setup(props, { emit }) {
    const { ui, attrs } = useMeiUI(
      'slideover',
      toRef(props, 'ui'),
      config,
      toRef(props, 'class'),
    )

    const isOpen: WritableComputedRef<boolean> = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      },
    })

    const transitionClass = computed(() => {
      if (!props.transition) {
        return {}
      }

      return {
        ...ui.value.transition,
        enterFrom:
          props.side === 'left'
            ? ui.value.translate.left
            : props.side === 'right'
              ? ui.value.translate.right
              : props.side === 'top'
                ? ui.value.translate.top
                : ui.value.translate.bottom,
        enterTo: ui.value.translate.base,
        leaveFrom: ui.value.translate.base,
        leaveTo:
          props.side === 'left'
            ? ui.value.translate.left
            : props.side === 'right'
              ? ui.value.translate.right
              : props.side === 'top'
                ? ui.value.translate.top
                : ui.value.translate.bottom,
      }
    })

    function close(value: boolean) {
      if (props.preventClose) {
        emit('closePrevented')

        return
      }

      isOpen.value = value
      emit('close')
    }

    const onAfterLeave = () => {
      emit('afterLeave')
    }

    provideUseId(() => useId())

    return {

      ui,
      attrs,
      isOpen,
      transitionClass,
      onAfterLeave,
      close,
    }
  },
})
</script>

<template>
  <TransitionRoot
    as="template"
    :appear="appear"
    :show="isOpen"
    @after-leave="onAfterLeave"
  >
    <HDialog
      :class="[
        ui.wrapper,
        { 'justify-end': side === 'right' },
        { 'items-end': side === 'bottom' },
      ]"
      v-bind="attrs"
      @close="close"
    >
      <TransitionChild
        v-if="overlay"
        as="template"
        :appear="appear"
        v-bind="ui.overlay.transition"
      >
        <div :class="[ui.overlay.base, ui.overlay.background]" />
      </TransitionChild>

      <TransitionChild
        as="template"
        :appear="appear"
        v-bind="transitionClass"
      >
        <HDialogPanel
          :class="[
            ui.base,
            side === 'left' || side === 'right' ? ui.width : ui.height,
            ui.background,
            ui.ring,
            ui.padding,
          ]"
        >
          <slot />
        </HDialogPanel>
      </TransitionChild>
    </HDialog>
  </TransitionRoot>
</template>
