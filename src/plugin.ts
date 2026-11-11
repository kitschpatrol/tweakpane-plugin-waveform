import type { BaseMonitorParams, BindingReader, MonitorBindingPlugin } from '@tweakpane/core'
import { createPlugin, parseRecord, ValueMap } from '@tweakpane/core'
import type { WaveformStyles, WaveformValue } from './view/waveform'
import { WaveformController } from './controller/waveform'

export type WaveformMonitorParams = BaseMonitorParams & {
	max?: number
	min?: number
	style?: WaveformStyles
	view?: string
}

function shouldShowWaveform(params: WaveformMonitorParams): boolean {
	return 'view' in params && params.view === 'waveform'
}

function isWaveformType(value: unknown): value is WaveformValue {
	return typeof value === 'object' && 'length' in (value as Record<string, unknown>)
}

export const WaveformPlugin: MonitorBindingPlugin<WaveformValue, WaveformMonitorParams> =
	createPlugin({
		accept(value, params) {
			if (!isWaveformType(value)) {
				return null
			}

			const result = parseRecord<WaveformMonitorParams>(
				// The legacy plugin always creates a monitor, even when readonly is false.
				{ ...params, readonly: true },
				(p) => ({
					max: p.optional.number,
					min: p.optional.number,
					readonly: p.required.constant(true),
					style: p.optional.custom<WaveformStyles>((style) =>
						style === 'linear' || style === 'bezier' ? style : undefined,
					),
					view: p.optional.string,
				}),
			)
			return result ? { initialValue: value, params: result } : null
		},
		binding: {
			defaultBufferSize: (params) => (shouldShowWaveform(params) ? 64 : 1),
			reader:
				(_args): BindingReader<WaveformValue> =>
				(exValue: unknown): WaveformValue =>
					isWaveformType(exValue) ? exValue : [],
		},
		controller(args) {
			return new WaveformController(args.document, {
				props: ValueMap.fromObject({
					lineStyle: ('style' in args.params ? args.params.style : null) ?? 'linear',
					max: ('max' in args.params ? args.params.max : null) ?? null,
					min: ('min' in args.params ? args.params.min : null) ?? null,
				}),
				value: args.value,
				viewProps: args.viewProps,
			})
		},
		id: 'monitor-waveform',
		type: 'monitor',
	})
