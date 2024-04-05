import { computed } from "vue";
import logger from "consola";
import { hexToRgb } from "../utils";
import { defineNuxtPlugin, useAppConfig, useNuxtApp, useHead } from "#imports";
import tailwindConfig from "#tailwind-config/index.mjs";
import { name } from "../../../package.json";

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig();
  const nuxtApp = useNuxtApp();
  const colors = tailwindConfig.theme.colors
  const root = computed(() => {
    const primary: Record<string, string> | undefined =
      colors[appConfig.meiUI.primary];
    const gray: Record<string, string> | undefined =
      colors[appConfig.meiUI.gray];

    if (!primary) {
      logger.warn(
        `[${name}] Primary color '${appConfig.meiUI?.primary}' not found in Tailwind config`
      );
    }
    if (!gray) {
      logger.warn(
        `[${name}] Gray color '${appConfig.meiUI?.gray}' not found in Tailwind config`
      );
    }
    return `:root {
      ${Object.entries(primary || colors.green)
        .map(
          ([key, value]) =>
            `--color-primary-${key}: ${hexToRgb(value as string)};`
        )
        .join("\n")}
      --color-primary-DEFAULT: var(--color-primary-500);

      .dark {
        --color-primary-DEFAULT: var(--color-primary-400);
    }`;
  });

  // Head
  const headData: any = {
    style: [
      {
        innerHTML: () => root.value,
        tagPriority: -2,
        id: "mei-ui-colors",
      },
    ],
  };

  // SPA mode
  if (
    import.meta.client &&
    nuxtApp.isHydrating &&
    !nuxtApp.payload.serverRendered
  ) {
    const style = document.createElement("style");

    style.innerHTML = root.value;
    style.setAttribute("data-mei-ui-colors", "");
    document.head.appendChild(style);

    headData.script = [
      {
        innerHTML:
          "document.head.removeChild(document.querySelector('[data-mei-ui-colors]'))",
      },
    ];
  }

  useHead(headData);
});
