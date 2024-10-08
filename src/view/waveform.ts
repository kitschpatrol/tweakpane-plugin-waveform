import {
	BufferedValue,
	ClassName,
	mapRange,
	SVG_NS,
	ValueMap,
	View,
	ViewProps,
} from '@tweakpane/core';

import {
	CubicBézierDrawerProvider,
	LinearDrawerProvider,
} from './waveform-drawer.js';

export type WaveformValue = Uint8Array | Uint16Array | Uint32Array | number[];

export type WaveformStyles = 'linear' | 'bezier';

export type WaveformProps = ValueMap<{
	max: number | null;
	min: number | null;
	lineStyle: WaveformStyles;
}>;

export type WaveformPoint = [number, number];

type WaveformDrawer = (
	point: WaveformPoint,
	index: number,
	points: WaveformPoint[],
) => string;

export interface IWaveformDrawerProvider {
	readonly drawer: WaveformDrawer;
}

interface Config {
	value: BufferedValue<WaveformValue>;
	viewProps: ViewProps;
	props: WaveformProps;
}

const className = ClassName('wfm');

/**
 * @hidden
 */
export class WaveformView implements View {
	public readonly element: HTMLElement;
	private readonly props: WaveformProps;
	private readonly value: BufferedValue<WaveformValue>;
	private readonly svgElem: SVGElement;
	private readonly pathElem: SVGPathElement;
	private readonly lineDrawerProvider: IWaveformDrawerProvider;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);

		this.svgElem = doc.createElementNS(SVG_NS, 'svg');
		this.svgElem.classList.add(className('g'));
		this.element.appendChild(this.svgElem);

		this.pathElem = doc.createElementNS(SVG_NS, 'path');
		this.svgElem.appendChild(this.pathElem);

		this.props = config.props;
		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_.bind(this));

		switch (this.props.get('lineStyle')) {
			case 'linear':
				this.lineDrawerProvider = new LinearDrawerProvider();
				break;
			case 'bezier':
				this.lineDrawerProvider = new CubicBézierDrawerProvider();
				break;
			default:
				this.lineDrawerProvider = new LinearDrawerProvider();
				break;
		}

		this.refresh();

		config.viewProps.handleDispose(() => {
			this.value.emitter.off('change', this.onValueChange_);
		});
	}

	private svgPath(points: WaveformPoint[], drawer: WaveformDrawer) {
		const d = points.reduce(
			(acc, point, i, a) =>
				i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${drawer(point, i, a)}`,
			'',
		);
		return d;
	}

	private refresh(): void {
		const bounds = this.svgElem.getBoundingClientRect();
		const latestValue = this.value.rawValue[0];

		if (latestValue) {
			const min =
				this.props.get('min') ?? Math.min(...(latestValue as number[])) - 1;
			const max =
				this.props.get('max') ?? Math.max(...(latestValue as number[])) + 1;

			const range = max - min;
			const points: WaveformPoint[] = [];

			const maxIndex = latestValue.length - 1;

			// Grid
			const gridWidth =
				latestValue.length > 32 ? 0 : bounds.width / (latestValue.length - 1);
			const gridHeight = range > 50 ? 0 : bounds.height / range;
			this.element.style.backgroundSize = `${gridWidth}px ${gridHeight}px`;

			// Graph
			latestValue.forEach((v, index) => {
				if (v === undefined) {
					return;
				}
				const x = mapRange(index, 0, maxIndex, 0, bounds.width);
				const y = mapRange(v, min, max, bounds.height, 0);
				points.push([Math.floor(x), Math.floor(y)]);
			});
			const d = this.svgPath(points, this.lineDrawerProvider.drawer);
			this.pathElem.setAttributeNS(null, 'd', d);
		}
	}

	private onValueChange_() {
		this.refresh();
	}
}
