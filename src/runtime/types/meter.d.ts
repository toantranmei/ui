import { meter } from '../ui.config'
import colors from '#mei-ui-colors'

export type MeterSize = keyof typeof meter.meter.size
export type MeterColor = keyof typeof meter.color | typeof colors[number]
