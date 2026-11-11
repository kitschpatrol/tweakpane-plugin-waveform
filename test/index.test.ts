import { Pane } from 'tweakpane'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as plugin from '../src/index'
import { WaveformPlugin } from '../src/plugin'

const bezierPattern = /^M 0,60 C [\d.,\s-]+ 50,30 C [\d.,\s-]+ 100,0$/u

describe('waveform plugin', () => {
	let pane: Pane | undefined

	beforeEach(() => {
		// The view maps samples into the SVG bounds, and happy-dom has no layout.
		vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 100, 60))
	})

	afterEach(() => {
		pane?.dispose()
		pane = undefined
		vi.restoreAllMocks()
	})

	function setup(options: Record<string, unknown> = {}, value: unknown = [0, 5, 10]) {
		pane = new Pane()
		pane.registerPlugin(plugin)
		const params = { wave: value }
		const binding = pane.addBinding(params, 'wave', {
			readonly: true,
			view: 'waveform',
			...options,
		})
		const root = binding.element.querySelector<HTMLElement>('.tp-wfmv')
		const path = binding.element.querySelector('path')
		if (!root || !path) {
			throw new Error('The waveform view was not created')
		}

		return { binding, getPath: () => path.getAttribute('d'), pane, params, root }
	}

	it('accepts array-like numeric values with valid params', () => {
		for (const value of [
			[0.1, 0.5, -0.2],
			new Uint8Array([1, 2]),
			new Uint16Array([1, 2]),
			new Uint32Array([1, 2]),
		]) {
			expect(WaveformPlugin.accept(value, { view: 'waveform' })?.initialValue).toBe(value)
		}

		expect(
			WaveformPlugin.accept([1], { max: 1, min: -1, style: 'bezier', view: 'waveform' })?.params,
		).toMatchObject({ max: 1, min: -1, readonly: true, style: 'bezier' })
		expect(WaveformPlugin.accept([1], { style: 'linear', view: 'waveform' })).not.toBeNull()
	})

	it('accepts any readonly flag and always creates a monitor', () => {
		for (const readonly of [undefined, false, true]) {
			expect(WaveformPlugin.accept([1], { readonly, view: 'waveform' })?.params.readonly).toBe(true)
		}
	})

	it('rejects non-array values and invalid params', () => {
		expect(WaveformPlugin.accept(42, { view: 'waveform' })).toBeNull()
		expect(WaveformPlugin.accept('wave', { view: 'waveform' })).toBeNull()
		expect(WaveformPlugin.accept(null, { view: 'waveform' })).toBeNull()
		expect(WaveformPlugin.accept(undefined, { view: 'waveform' })).toBeNull()
		expect(WaveformPlugin.accept([1], { style: 'step', view: 'waveform' })).toBeNull()
		expect(WaveformPlugin.accept([1], { min: '0', view: 'waveform' })).toBeNull()
		expect(WaveformPlugin.accept([1], { max: '1', view: 'waveform' })).toBeNull()
		expect(WaveformPlugin.accept([1], { view: 1 })).toBeNull()
	})

	it('registers the bundle and installs its compiled styles', () => {
		setup()
		expect(plugin.css).toContain('.tp-wfmv')
		expect(plugin.css).not.toContain('@use')
		expect(document.head.textContent).toContain('.tp-wfmv')
	})

	it.each([undefined, false, true])('creates a waveform monitor with readonly %s', (readonly) => {
		const { getPath } = setup({ max: 10, min: 0, readonly })
		expect(getPath()).toBe('M 0,60 L 50 30 L 100 0')
	})

	it('draws a linear path scaled between min and max', () => {
		const { getPath } = setup({ min: -20, max: 20 })
		expect(getPath()).toBe('M 0,30 L 50 22 L 100 15')
	})

	it('pads the value range by one when min and max are omitted', () => {
		const { getPath } = setup()
		expect(getPath()).toBe('M 0,55 L 50 30 L 100 5')
	})

	it('draws a bezier path through the same points', () => {
		const { getPath } = setup({ max: 10, min: 0, style: 'bezier' })
		expect(getPath()).toMatch(bezierPattern)
	})

	it('draws typed arrays', () => {
		const { getPath } = setup({ min: 0, max: 10 }, new Uint8Array([10, 5, 0]))
		expect(getPath()).toBe('M 0,0 L 50 30 L 100 60')
	})

	it('skips undefined samples from untyped callers', () => {
		const { getPath } = setup({ min: 0, max: 10 }, [0, undefined, 10])
		expect(getPath()).toBe('M 0,60 L 100 0')
	})

	it('redraws when the bound value changes', () => {
		const { binding, getPath, params } = setup({ min: 0, max: 10 })
		params.wave = [10, 5, 0]
		binding.refresh()
		expect(getPath()).toBe('M 0,0 L 50 30 L 100 60')
	})

	it('inherits the pane disabled state', () => {
		const { pane: currentPane, root } = setup()
		currentPane.disabled = true
		expect(root.classList.contains('tp-v-disabled')).toBe(true)
		currentPane.disabled = false
		expect(root.classList.contains('tp-v-disabled')).toBe(false)
	})

	it('stops redrawing after the binding is disposed', () => {
		const { binding, getPath, params } = setup({ min: 0, max: 10 })
		binding.dispose()
		params.wave = [10, 5, 0]
		binding.refresh()
		expect(getPath()).toBe('M 0,60 L 50 30 L 100 0')
		expect(binding.element.isConnected).toBe(false)
	})
})
