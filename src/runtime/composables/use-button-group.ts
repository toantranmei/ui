import {
  computed,
  getCurrentInstance,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
} from 'vue'
import type { ComponentInternalInstance, Ref } from 'vue'
import type { buttonGroup } from '#mei-ui/ui-configs'

interface ButtonGroupProps {
  orientation?: Ref<'horizontal' | 'vertical'>
  size?: Ref<string>
  ui?: Ref<Partial<typeof buttonGroup>>
  rounded?: Ref<{ start: string, end: string }>
}

// make a ButtonGroupContext type for injection. Should include ButtonGroupProps
interface ButtonGroupContext {
  children: ComponentInternalInstance[]
  register: (child: ComponentInternalInstance) => void
  unregister: (child: ComponentInternalInstance) => void
  orientation: 'horizontal' | 'vertical'
  size: string
  ui: Partial<typeof buttonGroup>
  rounded: { start: string, end: string }
}

export function useProvideButtonGroup(buttonGroupProps: ButtonGroupProps) {
  const instance = getCurrentInstance()
  const groupKey = `group-${instance?.uid}`
  const state = ref({
    children: [] as ComponentInternalInstance[], // Update the type of the children array
    register(child: ComponentInternalInstance) {
      this.children.push(child)
    },
    unregister(child: ComponentInternalInstance) {
      const index = this.children.indexOf(child)
      if (index > -1) {
        this.children.splice(index, 1)
      }
    },
    ...buttonGroupProps,
  })
  provide(groupKey, state as unknown as Ref<ButtonGroupContext>)
}

export function useInjectButtonGroup({ ui, props }: { ui: any, props: any }) {
  const instance = getCurrentInstance()

  provide('ButtonGroupContextConsumer', true)
  const isParentPartOfGroup = inject('ButtonGroupContextConsumer', false)

  // early return if a parent is already part of the group
  if (isParentPartOfGroup) {
    return {
      size: computed(() => props.size),
      rounded: computed(() => ui.value.rounded),
    }
  }

  let parent = instance?.parent
  let groupContext: Ref<ButtonGroupContext> | undefined

  // Traverse up the parent chain to find the nearest ButtonGroup
  while (parent && !groupContext) {
    if (parent.type.name === 'ButtonGroup') {
      groupContext = inject(`group-${parent.uid}`)
      break
    }
    parent = parent.parent
  }

  const positionInGroup = computed(() =>
    groupContext?.value.children.indexOf(instance!),
  )
  onMounted(() => groupContext?.value.register(instance!))
  onUnmounted(() => groupContext?.value.unregister(instance!))
  return {
    size: computed(() => groupContext?.value.size || props.size),
    rounded: computed(() => {
      if (!groupContext || positionInGroup.value === -1)
        return ui.value.rounded
      if (groupContext.value.children.length === 1)
        return groupContext.value.ui.rounded
      if (positionInGroup.value === 0)
        return groupContext.value.rounded.start
      if (positionInGroup.value === groupContext.value.children.length - 1)
        return groupContext.value.rounded.end
      return 'rounded-none'
    }),
  }
}
