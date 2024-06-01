import type { AppConfig } from 'nuxt/schema'
import type { formGroup } from '../ui-configs'
import type { ExtractDeepKey } from '.'

export type FormGroupSize = keyof typeof formGroup.size | ExtractDeepKey<AppConfig, ['ui', 'formGroup', 'size']>
