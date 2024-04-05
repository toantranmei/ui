import type { Component } from "vue";

export interface SlideOver {
  meiUI?: any;
  side?: "right" | "left";
  transition?: boolean;
  appear?: boolean;
  overlay?: boolean;
  preventClose?: boolean;
  modelValue?: boolean;
}

export interface SlideOverState {
  component: Component | string;
  props: SlideOver;
}
