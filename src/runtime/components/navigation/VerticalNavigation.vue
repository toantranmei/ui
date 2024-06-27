<template>
  <nav :class="ui.wrapper" v-bind="attrs">
    <ul v-for="(section, sectionIndex) of sections" :key="`section${sectionIndex}`">
      <li v-for="(link, index) of section" :key="`section${sectionIndex}-${index}`">
        <MeiLink
          v-slot="{ isActive }"
          v-bind="getMeiLinkProps(link)"
          :class="[ui.base, ui.padding, ui.width, ui.ring, ui.rounded, ui.font, ui.size]"
          :active-class="ui.active"
          :inactive-class="ui.inactive"
          @click="link.click"
          @keyup.enter="$event.target.blur()"
        >
          <slot name="avatar" :link="link" :is-active="isActive">
            <MeiAvatar
              v-if="link.avatar"
              v-bind="{ size: ui.avatar.size, ...link.avatar }"
              :class="[ui.avatar.base]"
            />
          </slot>
          <slot name="icon" :link="link" :is-active="isActive">
            <MeiIcon
              v-if="link.icon"
              :name="link.icon"
              :class="twMerge(twJoin(ui.icon.base, isActive ? ui.icon.active : ui.icon.inactive), link.iconClass)"
            />
          </slot>
          <slot :link="link" :is-active="isActive">
            <span v-if="link.label" :class="twMerge(ui.label, link.labelClass)">
              <span v-if="isActive" class="sr-only">
                Current page:
              </span>
              {{ link.label }}
            </span>
          </slot>
          <slot name="badge" :link="link" :is-active="isActive">
            <MeiBadge
              v-if="link.badge"
              v-bind="{
                size: ui.badge.size,
                color: ui.badge.color,
                variant: ui.badge.variant,
                ...((typeof link.badge === 'string' || typeof link.badge === 'number') ? { label: link.badge } : link.badge)
              }"
              :class="ui.badge.base"
            />
          </slot>
        </MeiLink>
      </li>
      <MeiDivider v-if="sectionIndex < sections.length - 1" :ui="ui.divider" />
    </ul>
  </nav>
</template>

<script lang="ts">
import { toRef, defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import MeiIcon from '../elements/Icon.vue'
import MeiAvatar from '../elements/Avatar.vue'
import MeiBadge from '../elements/Badge.vue'
import MeiLink from '../elements/Link.vue'
import MeiDivider from '../layout/Divider.vue'
import { useMeiUI } from '../../composables/useMeiUI'
import { mergeConfig, getMeiLinkProps } from '../../utils'
import type { VerticalNavigationLink, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { verticalNavigation } from '#mei-ui/ui.config'

const config = mergeConfig<typeof verticalNavigation>(appConfig.meiUI.strategy, appConfig.meiUI.verticalNavigation, verticalNavigation)

export default defineComponent({
  components: {
    MeiIcon,
    MeiAvatar,
    MeiBadge,
    MeiLink,
    MeiDivider
  },
  inheritAttrs: false,
  props: {
    links: {
      type: Array as PropType<VerticalNavigationLink[][] | VerticalNavigationLink[]>,
      default: () => []
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
  setup (props) {
    const { ui, attrs } = useMeiUI('verticalNavigation', toRef(props, 'ui'), config, toRef(props, 'class'))

    const sections = computed(() => (Array.isArray(props.links[0]) ? props.links : [props.links]) as VerticalNavigationLink[][])

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      sections,
      getMeiLinkProps,
      twMerge,
      twJoin
    }
  }
})
</script>
