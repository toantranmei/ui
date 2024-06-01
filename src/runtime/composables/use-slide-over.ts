import { inject, ref } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import type { Component, InjectionKey, ShallowRef } from 'vue'
import type { ComponentProps, SlideOver, SlideOverState } from '../types'

export const slidOverInjectionKey: InjectionKey<ShallowRef<SlideOverState>>
  = Symbol('nuxt-ui.slideOver')

function _useSlideOver() {
  const slideOverState = inject(slidOverInjectionKey)
  const isOpen = ref(false)

  function open<T extends Component>(
    component: T,
    props?: SlideOver & ComponentProps<T>,
  ) {
    if (!slideOverState) {
      throw new Error('useSlideOver() is called without provider')
    }

    slideOverState.value = {
      component,
      props: props ?? {},
    }

    isOpen.value = true
  }

  function close() {
    if (!slideOverState)
      return

    isOpen.value = false
  }

  /**
   * Allows updating the slideOver props
   */
  function patch<T extends Component = object>(
    props: Partial<SlideOver & ComponentProps<T>>,
  ) {
    if (!slideOverState)
      return

    slideOverState.value = {
      ...slideOverState.value,
      props: {
        ...slideOverState.value.props,
        ...props,
      },
    }
  }
  return {
    open,
    close,
    patch,
    isOpen,
  }
}

export const useSlideOver = createSharedComposable(_useSlideOver)
