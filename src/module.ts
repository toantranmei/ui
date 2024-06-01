import { createRequire } from 'node:module'
import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  createResolver,
  defineNuxtModule,
  installModule,
  useLogger,
} from '@nuxt/kit'

import type {
  CollectionNames,
  IconsPluginOptions,
} from '@egoist/tailwindcss-icons'
import { name, version } from '../package.json'
import createTemplates from './runtime/templates'
import type * as config from './runtime/ui-configs'
import type { DeepPartial, Strategy } from './runtime/types/utils'
import installTailwind from './runtime/tailwind'

const _require = createRequire(import.meta.url)
const defaultColors = _require('tailwindcss/colors.js')

delete defaultColors.lightBlue
delete defaultColors.warmGray
delete defaultColors.trueGray
delete defaultColors.coolGray
delete defaultColors.blueGray

type UI = {
  primary?: string
  gray?: string
  colors?: string[]
  strategy?: Strategy
  [key: string]: any
} & DeepPartial<typeof config>

declare module '@nuxt/schema' {
  interface AppConfigInput {
    meiUI?: UI
  }
  interface AppConfig {
    meiUI?: UI
  }
}

export interface ModuleOptions {
  /**
   * @default 'Mei'
   */
  prefix?: string

  /**
   * @default false
   */
  global?: boolean

  icons: CollectionNames[] | 'all' | IconsPluginOptions

  safelistColors?: string[]
  /**
   * Disables the global css styles added by the module.
   */
  disableGlobalStyles?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'meiUI',
  },
  defaults: {
    prefix: 'Mei',
    icons: ['heroicons'],
    safelistColors: ['primary'],
    disableGlobalStyles: false,
  },
  async setup(options, nuxt) {
    const logger = useLogger(name)
    const { resolve } = createResolver(import.meta.url)

    logger.info(`\`${name}\` setup starting`)

    // Transpile runtime
    const runtimeDir = resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push('@popperjs/core', '@headlessui/vue')

    nuxt.options.alias['#mei-ui'] = runtimeDir

    if (!options.disableGlobalStyles) {
      nuxt.options.css.push(resolve(runtimeDir, 'mei-ui.css'))
    }

    // create templates types definitions
    createTemplates(nuxt)

    // Install dependency modules
    await installModule('nuxt-icon')
    await installModule('@nuxtjs/color-mode', { classSuffix: '' })
    await installTailwind(options, nuxt, resolve)

    // Plugins
    addPlugin({
      src: resolve(runtimeDir, 'plugins', 'colors'),
    })

    addPlugin({
      src: resolve(runtimeDir, 'plugins', 'modals'),
    })

    addPlugin({
      src: resolve(runtimeDir, 'plugins', 'slide-overs'),
    })

    // Components
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'atoms'),
      prefix: options.prefix,
      global: options.global,
      watch: false,
    })

    // Composables
    addImportsDir(resolve(runtimeDir, 'composables'))

    logger.success(`\`${name}\` setup done`)
  },
})
