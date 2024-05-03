import { h, computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useMeiUI } from '../../composables/use-mei-ui'
import { mergeConfig, getSlotsChildren } from '../../utils'
import { useProvideButtonGroup } from '../../composables/use-button-group'
import type { ButtonSize, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { button, buttonGroup } from '#mei-ui/ui-configs'

const buttonConfig = mergeConfig<typeof button>(appConfig.ui.strategy, appConfig.ui.button, button)
const buttonGroupConfig = mergeConfig<typeof buttonGroup>(appConfig.ui.strategy, appConfig.ui.buttonGroup, buttonGroup)

export default defineComponent({
  name: 'ButtonGroup',
  inheritAttrs: false,
  props: {
    size: {
      type: String as PropType<ButtonSize>,
      default: null,
      validator (value: string) {
        return Object.keys(buttonConfig.size).includes(value)
      }
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
      validator (value: string) {
        return ['horizontal', 'vertical'].includes(value)
      }
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<Partial<typeof buttonGroupConfig> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  setup (props, { slots }) {
    const { ui, attrs } = useMeiUI('buttonGroup', toRef(props, 'ui'), buttonGroupConfig)

    const children = computed(() => getSlotsChildren(slots))

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper[props.orientation],
        ui.value.rounded,
        ui.value.shadow
      ), props.class)
    })

    const rounded = computed(() => ui.value.orientation[ui.value.rounded][props.orientation])

    useProvideButtonGroup({ orientation: toRef(props, 'orientation'), size: toRef(props, 'size'), ui, rounded })

    return () => h('div', { class: wrapperClass.value, ...attrs.value }, children.value)
  }
})
