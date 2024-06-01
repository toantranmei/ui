<script lang="ts">
import { computed, defineComponent, toRef } from 'vue'
import type { PropType } from 'vue'
import { twJoin, twMerge } from 'tailwind-merge'
import { useMeiUI } from '../../composables/use-mei-ui'
import { useToast } from '../../composables/use-toast'
import { mergeConfig } from '../../utils'
import type { Notification, Strategy } from '../../types'
import MeiNotification from './notification.vue'
import { useState } from '#imports'
// @ts-expect-error - no types available
import appConfig from '#build/app.config'
import { notifications } from '#mei-ui/ui-configs'

const config = mergeConfig<typeof notifications>(
  appConfig.meiUI.strategy,
  appConfig.meiUI.notifications,
  notifications,
)

export default defineComponent({
  components: {
    MeiNotification,
  },
  inheritAttrs: false,
  props: {
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
    const { ui, attrs } = useMeiUI('notifications', toRef(props, 'ui'), config)

    const toast = useToast()
    const notifications = useState<Notification[]>('notifications', () => [])

    const wrapperClass = computed(() => {
      return twMerge(
        twJoin(ui.value.wrapper, ui.value.position, ui.value.width),
        props.class,
      )
    })

    return {

      ui,
      attrs,
      toast,
      notifications,
      wrapperClass,
    }
  },
})
</script>

<template>
  <Teleport to="body">
    <div
      :class="wrapperClass"
      role="region"
      v-bind="attrs"
    >
      <div
        v-if="notifications.length"
        :class="ui.container"
      >
        <div
          v-for="notification of notifications"
          :key="notification.id"
        >
          <MeiNotification
            v-bind="notification"
            :class="notification.click && 'cursor-pointer'"
            @click="notification.click && notification.click(notification)"
            @close="toast.remove(notification.id)"
          >
            <template
              v-for="(_, name) in $slots"
              #[name]="slotData"
            >
              <slot
                :name="name"
                v-bind="slotData"
              />
            </template>
          </MeiNotification>
        </div>
      </div>
    </div>
  </Teleport>
</template>
