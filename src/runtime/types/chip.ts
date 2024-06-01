import type { chip } from '../ui-configs'
import type colors from '#mei-ui-colors'

export type ChipSize = keyof typeof chip.size
export type ChipColor = 'gray' | typeof colors[number]
export type ChipPosition = keyof typeof chip.position

export interface Chip {
  size?: ChipSize
  color?: ChipColor
  position?: ChipPosition
  text?: string
  inset?: boolean
  show?: boolean
}
