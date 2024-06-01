import { inject, ref } from 'vue'
import type { Component, InjectionKey, ShallowRef } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import type { ComponentProps, Modal, ModalState } from '../types'

export const modalInjectionKey: InjectionKey<ShallowRef<ModalState>>
  = Symbol('nuxt-ui.modal')

function _useModal() {
  const modalState = inject(modalInjectionKey)

  const isOpen = ref(false)

  function open<T extends Component>(
    component: T,
    props?: Modal & ComponentProps<T>,
  ) {
    if (modalState) {
      modalState.value = {
        component,
        props: props ?? {},
      }
    }
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
    if (modalState) {
      modalState.value = {
        component: 'div',
        props: {},
      }
    }
  }

  /**
   * Allows updating the modal props
   */
  function patch<T extends Component = object>(
    props: Partial<Modal & ComponentProps<T>>,
  ) {
    if (modalState) {
      modalState.value = {
        ...modalState.value,
        props: {
          ...modalState.value.props,
          ...props,
        },
      }
    }
  }

  return {
    isOpen,
    open,
    close,
    patch,
  }
}

export const useModal = createSharedComposable(_useModal)
