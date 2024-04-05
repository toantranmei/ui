import { createRequire } from "node:module";
import { name, version } from "../package.json";
import {
  defineNuxtModule,
  installModule,
  createResolver,
  useLogger,
  addPlugin,
  addComponentsDir,
  addImportsDir,
} from "@nuxt/kit";

import {
  iconsPlugin,
  type CollectionNames,
  type IconsPluginOptions,
  getIconCollections,
} from "@egoist/tailwindcss-icons";
import createTemplates from "./runtime/templates";
import {
  generateSafelist,
  excludeColors,
  customSafelistExtractor,
} from "./runtime/colors";
import * as config from "./runtime/ui-configs";
import type { DeepPartial, Strategy } from "./runtime/types/utils";
import type { Config } from "tailwindcss";
import { defaultExtractor as createDefaultExtractor } from "tailwindcss/lib/lib/defaultExtractor.js";

const defaultExtractor = createDefaultExtractor({
  tailwindConfig: { separator: ":" },
});
const _require = createRequire(import.meta.url);
const defaultColors = _require("tailwindcss/colors.js");

delete defaultColors.lightBlue;
delete defaultColors.warmGray;
delete defaultColors.trueGray;
delete defaultColors.coolGray;
delete defaultColors.blueGray;

type UI = {
  primary?: string;
  gray?: string;
  colors?: string[];
  strategy?: Strategy;
  [key: string]: any;
} & DeepPartial<typeof config>;

declare module "nuxt/schema" {
  interface AppConfigInput {
    meiUI?: UI;
  }
}
declare module "@nuxt/schema" {
  interface AppConfigInput {
    meiUI?: UI;
  }
}

export interface ModuleOptions {
  /**
   * @default 'Mei'
   */
  prefix?: string;

  /**
   * @default false
   */
  global?: boolean;

  icons: CollectionNames[] | "all" | IconsPluginOptions;

  safelistColors?: string[];
  /**
   * Disables the global css styles added by the module.
   */
  disableGlobalStyles?: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "meiUI",
    compatibility: {
      nuxt: "^3.10.0",
    },
  },
  defaults: {
    prefix: "Mei",
    icons: ["heroicons"],
    safelistColors: ["primary"],
    disableGlobalStyles: false,
  },
  async setup(options, nuxt) {
    const logger = useLogger(name);
    const { resolve } = createResolver(import.meta.url);

    logger.info(`\`${name}\` setup starting`);

    // Transpile runtime
    const runtimeDir = resolve("./runtime");
    nuxt.options.build.transpile.push(runtimeDir);
    nuxt.options.build.transpile.push("@popperjs/core", "@headlessui/vue");

    nuxt.options.alias["#mei-ui"] = runtimeDir;

    if (!options.disableGlobalStyles) {
      nuxt.options.css.push(resolve(runtimeDir, "mei-ui.css"));
    }

    nuxt.hook<any>("tailwindcss:config", function (tailwindConfig: Config) {
      tailwindConfig.theme = tailwindConfig.theme || {};
      tailwindConfig.theme.extend = tailwindConfig.theme.extend || {};
      tailwindConfig.theme.extend.colors =
        tailwindConfig.theme.extend.colors || {};

      const globalColors: any = {
        ...(tailwindConfig.theme.colors || defaultColors),
        ...tailwindConfig.theme.extend?.colors,
      };

      globalColors.primary = tailwindConfig.theme.extend.colors["primary"] = {
        50: "rgb(var(--color-primary-50) / <alpha-value>)",
        100: "rgb(var(--color-primary-100) / <alpha-value>)",
        200: "rgb(var(--color-primary-200) / <alpha-value>)",
        300: "rgb(var(--color-primary-300) / <alpha-value>)",
        400: "rgb(var(--color-primary-400) / <alpha-value>)",
        500: "rgb(var(--color-primary-500) / <alpha-value>)",
        600: "rgb(var(--color-primary-600) / <alpha-value>)",
        700: "rgb(var(--color-primary-700) / <alpha-value>)",
        800: "rgb(var(--color-primary-800) / <alpha-value>)",
        900: "rgb(var(--color-primary-900) / <alpha-value>)",
        950: "rgb(var(--color-primary-950) / <alpha-value>)",
        DEFAULT: "rgb(var(--color-primary-DEFAULT) / <alpha-value>)",
      };

      if (globalColors.gray) {
        globalColors.cool = tailwindConfig.theme.extend.colors["cool"] =
          defaultColors.gray;
      }

      globalColors.gray = tailwindConfig.theme.extend.colors["gray"] = {
        50: "rgb(var(--color-gray-50) / <alpha-value>)",
        100: "rgb(var(--color-gray-100) / <alpha-value>)",
        200: "rgb(var(--color-gray-200) / <alpha-value>)",
        300: "rgb(var(--color-gray-300) / <alpha-value>)",
        400: "rgb(var(--color-gray-400) / <alpha-value>)",
        500: "rgb(var(--color-gray-500) / <alpha-value>)",
        600: "rgb(var(--color-gray-600) / <alpha-value>)",
        700: "rgb(var(--color-gray-700) / <alpha-value>)",
        800: "rgb(var(--color-gray-800) / <alpha-value>)",
        900: "rgb(var(--color-gray-900) / <alpha-value>)",
        950: "rgb(var(--color-gray-950) / <alpha-value>)",
      };

      const colors = excludeColors(globalColors);

      nuxt.options.appConfig.meiUI = {
        primary: "green",
        gray: "cool",
        colors,
        strategy: "merge",
      };

      tailwindConfig.safelist = tailwindConfig.safelist || [];
      tailwindConfig.safelist.push(
        ...generateSafelist(options.safelistColors || [], colors)
      );
    });

    createTemplates(nuxt);

    // Modules
    await installModule("nuxt-icon");
    await installModule("@nuxtjs/color-mode", { classSuffix: "" });
    await installModule("@nuxtjs/tailwindcss", {
      exposeConfig: true,
      config: {
        darkMode: "class",
        plugins: [
          require("@tailwindcss/forms")({ strategy: "class" }),
          require("@tailwindcss/aspect-ratio"),
          require("@tailwindcss/typography"),
          require("@tailwindcss/container-queries"),
          require("@headlessui/tailwindcss"),
          iconsPlugin(
            Array.isArray(options.icons) || options.icons === "all"
              ? { collections: getIconCollections(options.icons) }
              : typeof options.icons === "object"
              ? (options.icons as IconsPluginOptions)
              : {}
          ),
        ],
        content: {
          files: [
            resolve(runtimeDir, "components/**/*.{vue,mjs,ts}"),
            resolve(runtimeDir, "ui.config/**/*.{mjs,js,ts}"),
          ],
          transform: {
            vue: (content) => {
              return content.replaceAll(/(?:\r\n|\r|\n)/g, " ");
            },
          },
          extract: {
            vue: (content) => {
              return [
                ...defaultExtractor(content),
                // @ts-ignore
                ...customSafelistExtractor(
                  options.prefix,
                  content,
                  nuxt.options.appConfig.meiUI["colors"],
                  options.safelistColors
                ),
              ];
            },
          },
        },
      },
    });

    // Plugins
    addPlugin({
      src: resolve(runtimeDir, "plugins", "colors"),
    });

    addPlugin({
      src: resolve(runtimeDir, "plugins", "modals"),
    });

    addPlugin({
      src: resolve(runtimeDir, "plugins", "slide-overs"),
    });

    // Components
    addComponentsDir({
      path: resolve(runtimeDir, "components", "atoms"),
      prefix: options.prefix,
      global: options.global,
      watch: false,
    });

    // Composables
    addImportsDir(resolve(runtimeDir, "composables"));

    logger.success(`\`${name}\` setup done`);
  },
});
