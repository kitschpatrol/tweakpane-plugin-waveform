<!-- title -->

# @kitschpatrol/tweakpane-plugin-waveform

<!-- /title -->

<!-- badges({ npmDownloads: true }) -->

[![NPM Package @kitschpatrol/tweakpane-plugin-waveform](https://img.shields.io/npm/v/@kitschpatrol/tweakpane-plugin-waveform.svg)](https://www.npmjs.com/package/@kitschpatrol/tweakpane-plugin-waveform)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/license/mit)
[![NPM Downloads @kitschpatrol/tweakpane-plugin-waveform](https://img.shields.io/npm/dm/@kitschpatrol/tweakpane-plugin-waveform)](https://www.npmjs.com/package/@kitschpatrol/tweakpane-plugin-waveform)

<!-- /badges -->

<!-- description -->

**Fork of tweakpane-plugin-waveform with build optimizations.**

<!-- /description -->

## Overview

This is a fork of [Simon Schödler](https://github.com/shoedler)'s [tweakpane-plugin-waveform](https://github.com/shoedler/tweakpane-plugin-waveform) with externalized dependencies.

This allows for smaller bundled file sizes in projects using multiple Tweakpane plugins.

It is published to NPM primarily for the [_Svelte Tweakpane UI_](https://kitschpatrol.com/svelte-tweakpane-ui) project, and will be kept in sync with the upstream version of the plugin, with minimal changes other than dependency externalization.

For most use cases, you probably don't want this fork!

## Background

The [Rollup](https://rollupjs.org) configuration provided in the [Tweakpane plugin template](https://github.com/tweakpane/plugin-template) does not externalize [`@tweakpane/core`](https://github.com/cocopon/tweakpane/tree/main/packages/core) as a production dependency.

Instead, it gets built into the single-file plugin artifact, which is what's published to NPM and imported by plugin consumers. This makes it easy to import as an ES module from a URL, but means that larger projects importing multiple Tweakpane plugins end up with duplicate copies of the `@tweakpane/core` code, adding about \~100 Kb to the final minified build for each plugin after the first.

Externalizing this dependency allows build tools like [vite](https://vite.dev) to share a single instance of the `@tweakpane/core` code across multiple plugins.

If you're not using a bundler, direct ESM imports from URLs can still work by defining the `@tweakpane/core` dependency in an [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap).

## Implementation notes

Note the package's name change from `tweakpane-plugin-waveform` to `@kitschpatrol/tweakpane-plugin-waveform`.

PNPM is used as the package manager.

## Versioning

In addition to the dependency externalization change, this fork also includes dependency updates. The fork published releases 1.0.1 through 1.0.3 before adopting its current scheme, so its version numbers are ahead of upstream. Releases are now tagged with a "fork" suffix and an incrementing number.

## License

Original plugin: [MIT](license.txt) © Simon Schödler

Fork modifications: [MIT](license.txt) © [Eric Mika](https://ericmika.com)
