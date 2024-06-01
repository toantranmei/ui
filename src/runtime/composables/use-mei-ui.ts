import { computed, toValue, useAttrs } from 'vue'
import type { Ref } from 'vue'
import { get, mergeConfig, omit } from '../utils'
import type { Strategy } from '../types'
import { useAppConfig } from '#imports'

export function useMeiUI<T>(key: string | (string | number)[], $ui?: Ref<(Partial<T> & { strategy?: Strategy }) | undefined>, $config?: Ref<T> | T, $wrapperClass?: Ref<string>, withAppConfig: boolean = false) {
  const $attrs = useAttrs()
  const appConfig = useAppConfig()

  const ui = computed(() => {
    const _ui = toValue($ui)
    const _config = toValue($config)
    const _wrapperClass = toValue($wrapperClass)

    return mergeConfig<T>(
      _ui?.strategy || (appConfig.meiUI?.strategy as Strategy),
      _wrapperClass ? { wrapper: _wrapperClass } : {},
      _ui || {},
      process.dev || withAppConfig
        ? get(appConfig.meiUI as Record<string, any>, key, {})
        : {},
      _config || {},
    )
  })

  const attrs = computed(() => omit($attrs, ['class']))

  return {
    ui,
    attrs,
  }
}
