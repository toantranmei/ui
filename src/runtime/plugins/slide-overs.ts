import { shallowRef } from "vue";
import { slidOverInjectionKey } from "../composables/use-slide-over";
import type { SlideOverState } from "../types";
import { defineNuxtPlugin } from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  const slideOverState = shallowRef<SlideOverState>({
    component: "div",
    props: {},
  });

  nuxtApp.vueApp.provide(slidOverInjectionKey, slideOverState);
});
