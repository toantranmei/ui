<template>
  <TransitionRoot :appear="appear" :show="isOpen" as="template" @after-leave="onAfterLeave">
    <HDialog :class="ui.wrapper" v-bind="attrs" @close="close">
      <TransitionChild v-if="overlay" as="template" :appear="appear" v-bind="ui.overlay.transition">
        <div :class="[ui.overlay.base, ui.overlay.background]" />
      </TransitionChild>

      <div :class="ui.inner">
        <div :class="[ui.container, !fullscreen && ui.padding]">
          <TransitionChild as="template" :appear="appear" v-bind="transitionClass">
            <HDialogPanel
              :class="[
                ui.base,
                ui.background,
                ui.ring,
                ui.shadow,
                fullscreen ? ui.fullscreen : [ui.width, ui.height, ui.rounded, ui.margin],
              ]"
            >
              <slot />
            </HDialogPanel>
          </TransitionChild>
        </div>
      </div>
    </HDialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { Dialog as HDialog, DialogPanel as HDialogPanel, TransitionRoot, TransitionChild, provideUseId } from '@headlessui/vue'
import { useMeiUI } from '../../composables/useMeiUI'
import { mergeConfig } from '../../utils'
import type { Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { modal } from '#mei-ui/ui.config'
import { useId } from '#imports'

const config = mergeConfig<typeof modal>(appConfig.meiUI.strategy, appConfig.meiUI.modal, modal)

export default defineComponent({
  components: {
    HDialog,
    HDialogPanel,
    TransitionRoot,
    TransitionChild
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    appear: {
      type: Boolean,
      default: false
    },
    overlay: {
      type: Boolean,
      default: true
    },
    transition: {
      type: Boolean,
      default: true
    },
    preventClose: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
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
  emits: ['update:modelValue', 'close', 'close-prevented', 'after-leave'],
  setup (props, { emit }) {
    const { ui, attrs } = useMeiUI('modal', toRef(props, 'ui'), config, toRef(props, 'class'))

    const isOpen = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const transitionClass = computed(() => {
      if (!props.transition) {
        return {}
      }

      return {
        ...ui.value.transition
      }
    })

    function close (value: boolean) {
      if (props.preventClose) {
        emit('close-prevented')

        return
      }

      isOpen.value = value

      emit('close')
    }

    const onAfterLeave = () => {
      emit('after-leave')
    }

    provideUseId(() => useId())

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      isOpen,
      transitionClass,
      onAfterLeave,
      close
    }
  }
})
</script>
