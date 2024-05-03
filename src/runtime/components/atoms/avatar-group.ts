import { h, cloneVNode, computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import MeiAvatar from './avatar.vue'
import { useMeiUI } from '../../composables/use-mei-ui'
import { mergeConfig, getSlotsChildren } from '../../utils'
import type { AvatarSize, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { avatar, avatarGroup } from '#mei-ui/ui-configs'

const avatarConfig = mergeConfig<typeof avatar>(appConfig.ui.strategy, appConfig.ui.avatar, avatar)

const avatarGroupConfig = mergeConfig<typeof avatarGroup>(appConfig.ui.strategy, appConfig.ui.avatarGroup, avatarGroup)

export default defineComponent({
  inheritAttrs: false,
  props: {
    size: {
      type: String as PropType<AvatarSize>,
      default: null,
      validator (value: string) {
        return Object.keys(avatarConfig.size).includes(value)
      }
    },
    max: {
      type: Number,
      default: null
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<Partial<typeof avatarGroupConfig> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  setup (props, { slots }) {
    const { ui, attrs } = useMeiUI('avatarGroup', toRef(props, 'ui'), avatarGroupConfig, toRef(props, 'class'))

    const children = computed(() => getSlotsChildren(slots))

    const max = computed(() => typeof props.max === 'string' ? parseInt(props.max, 10) : props.max)

    const clones = computed(() => children.value.map((node, index) => {
      const vProps: any = {}

      if (!props.max || (max.value && index < max.value)) {
        if (props.size) {
          vProps.size = props.size
        }

        vProps.class = node.props.class || ''
        vProps.class = twMerge(twJoin(vProps.class, ui.value.ring, ui.value.margin), vProps.class)

        return cloneVNode(node, vProps)
      }

      if (max.value !== undefined && index === max.value) {
        return h(MeiAvatar, {
          size: props.size || (avatarConfig.default.size as AvatarSize),
          text: `+${children.value.length - max.value}`,
          class: twJoin(ui.value.ring, ui.value.margin)
        })
      }

      return null
    }).filter(Boolean).reverse())

    return () => h('div', { class: ui.value.wrapper, ...attrs.value }, clones.value)
  }
})
