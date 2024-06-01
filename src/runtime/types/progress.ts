import type { progress } from '../ui-configs'
import type colors from '#mei-ui-colors'

export type ProgressSize = keyof typeof progress.progress.size
export type ProgressAnimation = keyof typeof progress.animation
export type ProgressColor = typeof colors[number]
