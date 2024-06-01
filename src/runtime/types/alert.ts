import type { AppConfig } from 'nuxt/schema'
import type { alert } from '../ui-configs'
import type { Button } from './button'
import type { ExtractDeepKey, ExtractDeepObject, NestedKeyOf } from '.'
import type colors from '#mei-ui-colors'

export type AlertColor = keyof typeof alert.color | ExtractDeepKey<AppConfig, ['ui', 'alert', 'color']> | typeof colors[number]
export type AlertVariant = keyof typeof alert.variant | ExtractDeepKey<AppConfig, ['ui', 'alert', 'variant']> | NestedKeyOf<typeof alert.color> | NestedKeyOf<ExtractDeepObject<AppConfig, ['ui', 'alert', 'color']>>

export interface AlertAction extends Button {
  click?: Function
}
