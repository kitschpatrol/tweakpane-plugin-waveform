# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4-fork.2] - 2026-11-11

### Added

- Export `WaveformMonitorParams`, `WaveformStyles`, and `WaveformValue` from the package entry points.
- Add `/lite` and minified lite builds that import `@tweakpane/core` so bundlers can share it across plugins.

### Changed

- Bundle `@tweakpane/core` in the default and minified ESM builds, allowing direct browser imports without a separate core import map.
- **Breaking:** Restrict package imports to the root, `/lite`, and `/package.json`, blocking previously accessible internal `dist` paths.
- **Breaking:** Raise the distributed JavaScript target from ES2015 to ES2022.
- **Breaking:** Narrow declared Node.js support to major versions 18, 20, 22, and 24, or 26 and later.

### Fixed

- Reject `null` waveform values without throwing.
- Remove the waveform change listener when a binding is disposed, preventing further redraws.
- Draw the newest buffered waveform sample instead of the oldest, keeping refreshed bindings up to date.
- Correct the exported `css` type from the build placeholder literal to `string`.

### Documentation

- Add installation and waveform-binding examples, document Tweakpane 4 and `/lite` dependency requirements, and summarize the fork's changes.
- Document contribution guidelines and shared tooling, and credit the original plugin template's contributions.

### Maintenance

- Update the pinned pnpm version to 12.16.1.
- Update the GitHub release-note and release publishing actions.
- Use a 1Password one-time password for npm publishing in the release script.
- Migrate Rollup and declaration builds to tsdown with inline SCSS, publint, and Are the Types Wrong checks; remove the prepare hook and legacy ZIP asset tooling.
- Adopt `@kitschpatrol/shared-config` and `ksc` for linting, formatting, and type checking, with VS Code contributor tasks.
- Move the interactive demo to `demo/` and serve it with Vite through `pnpm dev` for live reloading.
- Add Vitest and happy-dom regression tests for plugin registration, styles, validation, rendering, refreshes, and disposal, with build, lint, and test CI on Linux, macOS, and Windows.
- Add a monthly workflow that opens dependency-maintenance pull requests.
- Integrate `chagent` into `bumpp` releases to generate changelog entries and include them in release commits.
- Refresh development dependencies and pinned repository-maintenance actions, and update pnpm to 12.18.0.

## [1.0.4-fork.1] - 2026-10-15

### Documentation

- Document the `fork.N` release suffix and explain the fork's version relationship to upstream.
- Refresh documentation links and badges and clarify MIT license attribution for the original plugin and fork modifications.

### Maintenance

- Refresh development dependencies, including TypeScript 6 and pnpm 12, and migrate to ESLint 10 flat configuration.
- Declare Node.js `^24.16.0 || >=26.3.0` for contributor tooling and centralize pnpm dependency build approvals and audit exceptions.
- Use Sass's modern compiler API and make Rollup watch rebuild embedded styles after stylesheet edits, including recovery after Sass errors.
- Standardize build, cleanup, and release scripts on pnpm and shx, running tests and builds before publishing fork releases.
- Generate README metadata with mdat and validate it as part of the test command.
- Add scheduled link validation and upstream fork maintenance workflows.
- Refresh release and metadata workflows with pinned actions, explicit permissions, support for `v`-prefixed tags, and release validation against the default branch.

## [1.0.4-beta.3] - 2025-03-04

### Changed

- **Breaking:** Declare Node.js 18 or newer as the package's supported Node.js version.

### Documentation

- Correct beta versioning guidance to reference the next upstream patch release and clarify browser import-map usage.

### Maintenance

- Update the `@tweakpane/core` runtime dependency requirement to `^2.0.5`.
- Refresh development dependencies and move to pnpm 10 with explicit build-script approval for `@parcel/watcher`.
- Publish with npm's `latest` tag and update GitHub release and repository metadata workflows.

## [1.0.4-beta.2] - 2024-09-15

No notable changes.

## [1.0.4-beta.1] - 2024-09-15

### Added

- Provide public npm distribution of the fork as `@kitschpatrol/tweakpane-plugin-waveform`.

### Changed

- **Breaking:** Externalize `@tweakpane/core` as a runtime dependency so bundlers can share it across plugins; direct browser imports now need an import map.

### Fixed

- Keep bundle filenames unscoped so the scoped npm package's declared entry point resolves correctly.

### Documentation

- Document the fork's dependency externalization, browser import maps, pnpm setup, and beta versioning policy.

### Maintenance

- Adopt pnpm and refresh development dependencies, including Rollup 4, TypeScript 5.6, Prettier 3, and the maintained Rollup terser plugin.
- Add GitHub release automation, repository metadata synchronization, and an npm release script.

## [1.0.0] - 2023-11-25

### Added

- Expose bundle-level `id` and `css` exports for Tweakpane 4 plugin registration.

### Changed

- **Breaking:** Require Tweakpane 4 and migrate waveform monitoring from `pane.addMonitor` to `pane.addBinding`.
- **Breaking:** Ship ES modules instead of UMD bundles; browser integrations must use module imports instead of the `TweakpaneWaveformPlugin` global.
- Infer omitted `min` and `max` bounds from each plotted array with one unit of padding, replacing the fixed 0–100 defaults.

### Fixed

- Refresh waveforms from the newest buffered sample instead of the oldest.

### Documentation

- Update usage examples for Tweakpane 4's `addBinding` API and ES module imports.
- Document automatic bounds and grid visibility, and expand the browser demo with normalized floating-point data and automatic scaling.

### Maintenance

- Refresh TypeScript and ESLint tooling, adapt build configuration for ES modules, and add a local HTTP server for browser development.

## [0.1.2] - 2022-11-08

### Fixed

- Correct the package's `main` entry to resolve the waveform bundle instead of the nonexistent essentials bundle.

### Documentation

- Add an npm version badge linking to the published package.

## [0.1.0] - 2022-11-07

### Added

- Add a Tweakpane 3 waveform monitor for numeric arrays and Uint8Array, Uint16Array, and Uint32Array values, registered through the exported `plugins` bundle.
- Support linear and Bézier curves, configurable monitoring intervals, explicit minimum and maximum bounds defaulting to 0–100, and adaptive grid lines.
- Provide browser UMD bundles, minified builds, and TypeScript declarations.

### Documentation

- Add browser and package registration instructions, illustrated array examples, and a Web Audio waveform demo.

### Maintenance

- Establish TypeScript and Rollup builds, linting, formatting, watch mode, and release asset packaging, with corrected formatting and test scripts.

[0.1.0]: https://github.com/kitschpatrol/tweakpane-plugin-waveform/releases/tag/0.1.0
[0.1.2]: https://github.com/kitschpatrol/tweakpane-plugin-waveform/compare/0.1.0...0.1.2
[1.0.0]: https://github.com/kitschpatrol/tweakpane-plugin-waveform/compare/0.1.2...1.0.0
[1.0.4-beta.1]: https://github.com/kitschpatrol/tweakpane-plugin-waveform/compare/1.0.0...1.0.4-beta.1
[1.0.4-beta.2]: https://github.com/kitschpatrol/tweakpane-plugin-waveform/compare/1.0.4-beta.1...1.0.4-beta.2
[1.0.4-beta.3]: https://github.com/kitschpatrol/tweakpane-plugin-waveform/compare/1.0.4-beta.2...1.0.4-beta.3
[1.0.4-fork.1]: https://github.com/kitschpatrol/tweakpane-plugin-waveform/compare/1.0.4-beta.3...1.0.4-fork.1
[1.0.4-fork.2]: https://github.com/kitschpatrol/tweakpane-plugin-waveform/compare/1.0.4-fork.1...1.0.4-fork.2
