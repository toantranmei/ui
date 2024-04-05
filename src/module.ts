import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  useLogger,
} from "@nuxt/kit";
import { name, version } from "../package.json";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "meiUI",
    compatibility: {
      nuxt: "^3.10.0",
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup() {
    const logger = useLogger(name);
    const { resolve } = createResolver(import.meta.url);

    logger.info(`\`${name}\` setup starting..`);

    // 1. Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolve("./runtime/plugin"));

    logger.success(`\`${name}\` setup done!`);
  },
});
