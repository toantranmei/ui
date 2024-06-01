import { createDefu, defu } from 'defu'
import { extendTailwindMerge } from 'tailwind-merge'
import type { Strategy } from '../types'

const customTwMerge = extendTailwindMerge<string, string>({
  extend: {
    classGroups: {
      icons: [(classPart: string) => classPart.startsWith('i-')],
    },
  },
})

const defuTwMerge = createDefu((obj, key, value, namespace) => {
  if (namespace === 'default' || namespace.startsWith('default.')) {
    return false
  }
  if (namespace === 'popper' || namespace.startsWith('popper.')) {
    return false
  }
  if (namespace.endsWith('avatar') && key === 'size') {
    return false
  }
  if (namespace.endsWith('chip') && key === 'size') {
    return false
  }
  if (
    (namespace.endsWith('badge') && key === 'size')
    || key === 'color'
    || key === 'variant'
  ) {
    return false
  }
  if (
    typeof obj[key] === 'string'
    && typeof value === 'string'
    && obj[key]
    && value
  ) {
    // @ts-expect-error - Typings not available
    obj[key] = customTwMerge(obj[key], value)
    return true
  }
})

export function mergeConfig<T>(strategy: Strategy, ...configs: any): T {
  if (strategy === 'override') {
    return defu({}, ...configs) as T
  }

  return defuTwMerge({}, ...configs) as T
}

export function hexToRgb(hex: string) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (_, r, g, b) => {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${Number.parseInt(result[1], 16)} ${Number.parseInt(result[2], 16)} ${Number.parseInt(result[3], 16)}`
    : null
}

export function getSlotsChildren(slots: any) {
  let children = slots.default?.()
  if (children?.length) {
    children = children
      .flatMap((c: any) => {
        if (typeof c.type === 'symbol') {
          if (typeof c.children === 'string') {
            // `v-if="false"` or commented node
            return false
          }
          return c.children
        }
        else if (c.type.name === 'ContentSlot') {
          return c.ctx.slots.default?.()
        }
        return c
      })
      .filter(Boolean)
  }
  return children || []
}

/**
 * "123-foo" will be parsed to 123
 * This is used for the .number modifier in v-model
 */
export function looseToNumber(val: any): any {
  const n = Number.parseFloat(val)
  return Number.isNaN(n) ? val : n
}

export * from './lodash'
export * from './link'
