<script lang="ts">
import { computed, defineComponent, ref, toRef } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'

import { useMeiUI } from '../../composables/use-mei-ui'
import { usePopper } from '../../composables/use-popper'
import { mergeConfig } from '../../utils'
import type { PopperOptions, Strategy } from '../../types'
// @ts-expect-error - no types available
import appConfig from '#build/app.config'
import { tooltip } from '#mei-ui/ui-configs'

const config = mergeConfig<typeof tooltip>(
  appConfig.meiUI.strategy,
  appConfig.meiUI.tooltip,
  tooltip,
)

export default defineComponent({
  inheritAttrs: false,
  props: {
    text: {
      type: String,
      default: null,
    },
    prevent: {
      type: Boolean,
      default: false,
    },
    shortcuts: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    openDelay: {
      type: Number,
      default: () => config.default.openDelay,
    },
    closeDelay: {
      type: Number,
      default: () => config.default.closeDelay,
    },
    popper: {
      type: Object as PropType<PopperOptions>,
      default: () => ({}),
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
    const { ui, attrs } = useMeiUI(
      'tooltip',
      toRef(props, 'ui'),
      config,
      toRef(props, 'class'),
    )

    const popper = computed<PopperOptions>(() =>
      defu({}, props.popper, ui.value.popper as PopperOptions),
    )

    const [trigger, container] = usePopper(popper.value)

    const open = ref(false)

    let openTimeout: NodeJS.Timeout | null = null
    let closeTimeout: NodeJS.Timeout | null = null

    // Methods

    function onMouseEnter() {
      // cancel programmed closing
      if (closeTimeout) {
        clearTimeout(closeTimeout)
        closeTimeout = null
      }
      // dropdown already open
      if (open.value) {
        return
      }
      openTimeout
        = openTimeout
        || setTimeout(() => {
          open.value = true
          openTimeout = null
        }, props.openDelay)
    }

    function onMouseLeave() {
      // cancel programmed opening
      if (openTimeout) {
        clearTimeout(openTimeout)
        openTimeout = null
      }
      // dropdown already closed
      if (!open.value) {
        return
      }
      closeTimeout
        = closeTimeout
        || setTimeout(() => {
          open.value = false
          closeTimeout = null
        }, props.closeDelay)
    }

    return {

      ui,
      attrs,

      popper,
      trigger,
      container,
      open,
      onMouseEnter,
      onMouseLeave,
    }
  },
})
</script>

<template>
  <div
    ref="trigger"
    :class="ui.wrapper"
    v-bind="attrs"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot :open="open">
      Hover
    </slot>

    <div
      v-if="open && !prevent"
      ref="container"
      :class="[ui.container, ui.width]"
    >
      <Transition
        appear
        v-bind="ui.transition"
      >
        <div>
          <div
            v-if="popper.arrow"
            data-popper-arrow
            :class="Object.values(ui.arrow)"
          />

          <div
            :class="[
              ui.base,
              ui.background,
              ui.color,
              ui.rounded,
              ui.shadow,
              ui.ring,
            ]"
          >
            <slot name="text">
              {{ text }}
            </slot>

            <span
              v-if="shortcuts?.length"
              :class="ui.shortcuts"
            >
              <span :class="ui.middot">&middot;</span>

              <MeiKbd
                v-for="shortcut of shortcuts"
                :key="shortcut"
                size="xs"
              >
                {{ shortcut }}
              </MeiKbd>
            </span>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
