import type { TpPlugin } from '@tweakpane/core'
import { WaveformPlugin } from './plugin'
import pluginCss from './styles/plugin.scss?inline'

export const id = 'waveform'

export const css: string = pluginCss

export const plugins: TpPlugin[] = [WaveformPlugin]

export type { WaveformMonitorParams } from './plugin'
export type { WaveformStyles, WaveformValue } from './view/waveform'
