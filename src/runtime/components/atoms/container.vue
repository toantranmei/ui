<template>
  <component
    :is="as"
    :class="containerClass"
    v-bind="attrs"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from "vue";
import type { PropType } from "vue";
import { twMerge, twJoin } from "tailwind-merge";
import { useMeiUI } from "../../composables/use-mei-ui";
import { mergeConfig } from "../../utils";
import type { Strategy } from "../../types";
import appConfig from "#build/app.config.mjs";
import { container } from "#mei-ui/ui-configs";

const config = mergeConfig<typeof container>(
  appConfig.meiUI.strategy as Strategy,
  appConfig.meiUI.container,
  container
);

export default defineComponent({
  inheritAttrs: false,
  props: {
    as: {
      type: String,
      default: "div",
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => "",
    },
    ui: {
      type: Object as PropType<
        Partial<typeof config> & { strategy?: Strategy }
      >,
      default: () => ({}),
    },
  },
  setup(props) {
    const { ui, attrs } = useMeiUI("container", toRef(props, "ui"), config);

    const containerClass = computed(() => {
      return twMerge(
        twJoin(ui.value.base, ui.value.padding, ui.value.constrained),
        props.class
      );
    });

    return {
      attrs,
      containerClass,
    };
  },
});
</script>
