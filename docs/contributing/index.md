---
title: "Contributing"
sidebar_position: 1
---

# Contributing

SDIF is developed in the open under the [sdif-format](https://github.com/sdif-format) GitHub organization. Contributions are welcome across all three repositories.

## Repositories

- [**sdif**](https://github.com/sdif-format/sdif) — the reference Python implementation. This includes the parser, CLI, canonicalizer, schema validator, and JSON/AI conversion tools.
- [**sdif-benchmarks**](https://github.com/sdif-format/sdif-benchmarks) — the reproducible benchmark suite for comparing SDIF against JSON, YAML, XML, and TOON across token efficiency, semantic density, and round-trip fidelity.
- [**tree-sitter-sdif**](https://github.com/sdif-format/tree-sitter-sdif) — the Tree-sitter grammar for SDIF syntax highlighting.

## General Guidelines

When contributing to any of these repositories:

- **Include tests.** Changes to parsing, canonicalization, or conversion logic should be accompanied by test cases that exercise the new or changed behavior.
- **Include fixtures.** For format changes or new parser behavior, add input/output fixture files alongside the tests so that the expected behavior is explicit and reproducible.
- **Keep changes focused.** A pull request that addresses one concern is easier to review than one that bundles multiple unrelated changes.

## Where to Start

- For bugs or parse failures, open an issue in the `sdif` repository with a minimal reproducing document.
- For benchmark methodology questions, open an issue in the `sdif-benchmarks` repository.
- For editor integration questions or grammar bugs, open an issue in the `tree-sitter-sdif` repository.

The following sub-pages cover contributing in more depth:

- [Implementation Guide](./implementation-guide) — how to build an SDIF parser in another language.
- [Conformance Suite](./conformance-suite) — how to validate an implementation against the suite.
- [Release Process](./release-process) — how the reference implementation is versioned and released.
