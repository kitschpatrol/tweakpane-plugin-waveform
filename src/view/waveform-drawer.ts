import type { IWaveformDrawerProvider, WaveformPoint } from './waveform'

export class LinearDrawerProvider implements IWaveformDrawerProvider {
	public readonly drawer = (point: WaveformPoint): string => `L ${point[0]} ${point[1]}`
}

export class CubicBézierDrawerProvider implements IWaveformDrawerProvider {
	public readonly drawer = (
		point: WaveformPoint,
		index: number,
		points: WaveformPoint[],
	): string => {
		const previous = points[index - 1] ?? point
		// Start control point
		const [cpsX, cpsY] = this.controlPoint(previous, points[index - 2], point)
		// End control point
		const [cpeX, cpeY] = this.controlPoint(point, previous, points[index + 1], true)
		return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`
	}

	private controlPoint(
		current: WaveformPoint,
		previous: undefined | WaveformPoint,
		next: undefined | WaveformPoint,
		reverse?: boolean,
	): WaveformPoint {
		// When 'current' is the first or last point of the array  'previous' or 'next' don't exist. Replace with 'current'
		const a = previous ?? current
		const b = next ?? current

		const smoothing = 0.2

		const lengthX = b[0] - a[0]
		const lengthY = b[1] - a[1]

		const length = Math.hypot(lengthX, lengthY) * smoothing
		const angle = Math.atan2(lengthY, lengthX) + (reverse ? Math.PI : 0)

		const x = current[0] + Math.cos(angle) * length
		const y = current[1] + Math.sin(angle) * length

		return [x, y]
	}
}
