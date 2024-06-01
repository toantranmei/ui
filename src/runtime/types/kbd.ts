import type { AppConfig } from 'nuxt/schema'
import type { kbd } from '../ui-configs'
import type { ExtractDeepKey } from '.'

export type KbdSize =
  | keyof typeof kbd.size
  | ExtractDeepKey<AppConfig, ['ui', 'kbd', 'size']>
