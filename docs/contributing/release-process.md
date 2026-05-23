---
title: "Release Process"
sidebar_position: 4
---

# Release Process

This page describes how the SDIF Python package and related repositories are versioned and released.

## Versioning

The `sdif` Python package follows [semantic versioning](https://semver.org/):

- **Patch releases** (`1.0.x`) — bug fixes and minor corrections that do not change format behavior or the public API.
- **Minor releases** (`1.x.0`) — new features, new CLI commands, or additions to the format that are backward-compatible.
- **Major releases** (`x.0.0`) — breaking changes to the public API or the format itself.

## Spec and Conformance Suite Coordination

Format changes require more than a code change. Any release that modifies the format specification must also:

- Update the relevant spec documentation pages to reflect the change.
- Add or update conformance fixtures in the `sdif-format/sdif` repository to cover the new behavior.
- Ensure the conformance suite passes against the updated implementation before the release is tagged.

This keeps the spec, the implementation, and the conformance suite in sync.

## Canonical Profile Versioning

The canonical form is identified by the profile string `canonical-syntax-v1`. This identifier is part of the format contract: any two implementations that produce canonical output for the same document must agree on both the bytes and the hash.

A change that would alter the canonical bytes for any existing valid document is a breaking change to the canonical profile. Such a change would require a new profile version identifier (for example, `canonical-syntax-v2`) rather than modifying `canonical-syntax-v1` in place. This ensures that hashes computed under the old profile remain valid and that implementations can identify which canonical rules apply.

## Repository Releases

Each of the three repositories under `sdif-format` is released independently:

- `sdif` — the Python package, released to PyPI as `sdif`.
- `sdif-benchmarks` — released when benchmark methodology or inputs change.
- `tree-sitter-sdif` — released when the grammar changes in a way that affects parsing or highlighting behavior.
