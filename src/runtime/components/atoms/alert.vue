<script lang="ts">
import { computed, defineComponent, toRef } from 'vue'
import type { PropType } from 'vue'
import { twJoin, twMerge } from 'tailwind-merge'
import { useMeiUI } from '../../composables/use-mei-ui'
import type { AlertAction, AlertColor, AlertVariant, Avatar, Button, Strategy } from '../../types'
import { mergeConfig } from '../../utils'
import MeiIcon from './icon.vue'
import MeiAvatar from './avatar.vue'
import MeiButton from './button.vue'
// @ts-expect-error - no types available
import appConfig from '#build/app.config'
import { alert } from '#mei-ui/ui-configs'

const config = mergeConfig<typeof alert>(appConfig.meiUI.strategy, appConfig.meiUI.alert, alert)

export default defineComponent({
  components: {
    MeiIcon,
    MeiAvatar,
    MeiButton,
  },
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: () => config.default.icon,
    },
    avatar: {
      type: Object as PropType<Avatar>,
      default: null,
    },
    closeButton: {
      type: Object as PropType<Button>,
      default: () => config.default.closeButton as unknown as Button,
    },
    actions: {
      type: Array as PropType<AlertAction[]>,
      default: () => [],
    },
    color: {
      type: String as PropType<AlertColor>,
      default: () => config.default.color,
      validator(value: string) {
        return [...appConfig.meiUI.colors, ...Object.keys(config.color)].includes(value)
      },
    },
    variant: {
      type: String as PropType<AlertVariant>,
      default: () => config.default.variant,
      validator(value: string) {
        return [
          ...Object.keys(config.variant),
          ...Object.values(config.color).flatMap(value => Object.keys(value)),
        ].includes(value)
      },
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => '',
    },
    ui: {
      type: Object as PropType<Partial<typeof config> & { strategy?: Strategy }>,
      default: () => ({}),
    },
  },
  emits: ['close'],
  setup(props) {
    const { ui, attrs } = useMeiUI('alert', toRef(props, 'ui'), config)

    const alertClass = computed(() => {
      const variant = ui.value.color?.[props.color as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.rounded,
        ui.value.shadow,
        ui.value.padding,
        variant?.replaceAll('{color}', props.color),
      ), props.class)
    })

    function onAction(action: AlertAction) {
      if (action.click) {
        action.click()
      }
    }

    return {

      ui,
      attrs,
      alertClass,
      onAction,
      twMerge,
    }
  },
})
</script>

<template>
  <div
    :class="alertClass"
    v-bind="attrs"
  >
    <div
      class="flex"
      :class="[ui.gap, { 'items-start': (description || $slots.description), 'items-center': !description && !$slots.description }]"
    >
      <slot
        name="icon"
        :icon="icon"
      >
        <MeiIcon
          v-if="icon"
          :name="icon"
          :ui="ui.icon.base"
        />
      </slot>
      <slot
        name="avatar"
        :avatar="avatar"
      >
        <MeiAvatar
          v-if="avatar"
          v-bind="{ size: ui.avatar.size, ...avatar }"
          :class="ui.avatar.base"
        />
      </slot>

      <div :class="ui.inner">
        <p
          v-if="(title || $slots.title)"
          :class="ui.title"
        >
          <slot
            name="title"
            :title="title"
          >
            {{ title }}
          </slot>
        </p>
        <p
          v-if="description || $slots.description"
          :class="twMerge(ui.description, !(title && $slots.title) && 'mt-0 leading-5')"
        >
          <slot
            name="description"
            :description="description"
          >
            {{ description }}
          </slot>
        </p>

        <div
          v-if="(description || $slots.description) && actions.length"
          :class="ui.actions"
        >
          <MeiButton
            v-for="(action, index) of actions"
            :key="index"
            v-bind="{ ...(ui.default.actionButton || {}), ...action }"
            @click.stop="onAction(action)"
          />
        </div>
      </div>
      <div
        v-if="closeButton || (!description && !$slots.description && actions.length)"
        :class="twMerge(ui.actions, 'mt-0')"
      >
        <template v-if="!description && !$slots.description && actions.length">
          <MeiButton
            v-for="(action, index) of actions"
            :key="index"
            v-bind="{ ...(ui.default.actionButton || {}), ...action }"
            @click.stop="onAction(action)"
          />
        </template>

        <MeiButton
          v-if="closeButton"
          aria-label="Close"
          v-bind="{ ...(ui.default.closeButton || {}), ...closeButton }"
          @click.stop="$emit('close')"
        />
      </div>
    </div>
  </div>
</template>
