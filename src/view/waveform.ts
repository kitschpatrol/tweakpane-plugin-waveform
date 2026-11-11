import type { BufferedValue, ValueMap, View, ViewProps } from '@tweakpane/core'
import { ClassName, mapRange, SVG_NS } from '@tweakpane/core'
import { CubicBézierDrawerProvider, LinearDrawerProvider } from './waveform-drawer'

export type WaveformValue = number[] | Uint8Array | Uint16Array | Uint32Array

export type WaveformStyles = 'bezier' | 'linear'

export type WaveformProps = ValueMap<{
	lineStyle: WaveformStyles
	max: null | number
	min: null | number
}>

export type WaveformPoint = [number, number]

type WaveformDrawer = (point: WaveformPoint, index: number, points: WaveformPoint[]) => string

export type IWaveformDrawerProvider = {
	readonly drawer: WaveformDrawer
}

type Config = {
	props: WaveformProps
	value: BufferedValue<WaveformValue>
	viewProps: ViewProps
}

const className = ClassName('wfm')

/**
 * @ignore
 */
export class WaveformView implements View {
	public readonly element: HTMLElement
	private readonly lineDrawerProvider: IWaveformDrawerProvider
	private readonly pathElem: SVGPathElement
	private readonly props: WaveformProps
	private readonly svgElem: SVGElement
	private readonly value: BufferedValue<WaveformValue>

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this)

		this.element = doc.createElement('div')
		this.element.classList.add(className())
		config.viewProps.bindClassModifiers(this.element)

		this.svgElem = doc.createElementNS(SVG_NS, 'svg')
		this.svgElem.classList.add(className('g'))
		this.element.append(this.svgElem)

		this.pathElem = doc.createElementNS(SVG_NS, 'path')
		this.svgElem.append(this.pathElem)

		this.props = config.props
		this.value = config.value
		this.value.emitter.on('change', this.onValueChange_)

		this.lineDrawerProvider =
			this.props.get('lineStyle') === 'bezier'
				? new CubicBézierDrawerProvider()
				: new LinearDrawerProvider()

		this.refresh()

		config.viewProps.handleDispose(() => {
			this.value.emitter.off('change', this.onValueChange_)
		})
	}

	private onValueChange_() {
		this.refresh()
	}

	private refresh(): void {
		const bounds = this.svgElem.getBoundingClientRect()
		const latestValue = this.value.rawValue[0]

		if (!latestValue) {
			return
		}

		const min = this.props.get('min') ?? Math.min(...(latestValue as number[])) - 1
		const max = this.props.get('max') ?? Math.max(...(latestValue as number[])) + 1

		const range = max - min
		const points: WaveformPoint[] = []

		const maxIndex = latestValue.length - 1

		// Grid
		const gridWidth = latestValue.length > 32 ? 0 : bounds.width / (latestValue.length - 1)
		const gridHeight = range > 50 ? 0 : bounds.height / range
		this.element.style.backgroundSize = `${gridWidth}px ${gridHeight}px`

		// Graph. Untyped callers can pass arrays with holes or undefined entries, which are skipped.
		const samples: Iterable<[number, number | undefined]> = latestValue.entries()
		for (const [index, v] of samples) {
			if (v === undefined) {
				continue
			}

			const x = mapRange(index, 0, maxIndex, 0, bounds.width)
			const y = mapRange(v, min, max, bounds.height, 0)
			points.push([Math.floor(x), Math.floor(y)])
		}

		const d = this.svgPath(points, this.lineDrawerProvider.drawer)
		this.pathElem.setAttributeNS(null, 'd', d)
	}

	private svgPath(points: WaveformPoint[], drawer: WaveformDrawer) {
		return points
			.map((point, index) =>
				index === 0 ? `M ${point[0]},${point[1]}` : drawer(point, index, points),
			)
			.join(' ')
	}
}
