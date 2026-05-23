---
title: "Changelog"
sidebar_position: 100
---

# Changelog

## [Unreleased]

Changes in this section are merged to `main` but not yet included in a tagged release.

### Fixed

- **Canonicalization preserves list literals.** `canonicalize → parse` now round-trips list literals as lists, not as quoted strings. Previously, any list literal containing a comma or an inner double-quote (e.g. `[a,b,c]` or `["alpha","beta"]`) was re-quoted by the canonicalizer, converting it from a list into a string after the next parse. The affected canonical fixture (`plan`) has been regenerated with the corrected representation.

- **SDIF AI `$`-column cells preserve string type through expansion.** After `expand_ai_doc()` strips the `$` suffix from column names and records their indices in `Table.quoted_columns`, the JSON decoder now honours that set when decoding table cells. Previously, numeric-looking strings such as HTTP status codes (`"200"`, `"404"`) were coerced to integers during SDIF AI → JSON conversion.

- **`expand_ai_doc()` added to `sdif.ai`.** A new function that expands `.sdif.ai` aliases and returns a `Document` without invoking the canonicalizer. Callers that need semantic equivalence (not canonical form) should use `expand_ai_doc()` instead of `sdif_from_ai()`. The latter now delegates to `expand_ai_doc()` before canonicalizing.

### Benchmark

- SDIF AI round-trip fidelity reaches **100% across all 20 benchmark documents** after the above fixes. Canonical SDIF also remains at 100%.

---

## 1.0.0 — 2026-05-22

### Stable v1 contract

- Freezes `@sdif 1.0` and `@sdif.ai 1.0` as the supported v1 document directives.
- Defines `canonical-syntax-v1` as the reproducible source of canonical hashes.
- Treats `.sdif.ai` as a derived, reversible projection of canonical SDIF.
- Ships the Python parser, canonicalizer, validator, CLI, conformance fixtures, and shared specification.

### Benchmark tracks

- Token efficiency, context packing, round-trip fidelity, delta compactness, retrieval accuracy, and semantic quality.
- Evidence written to `results/<track>/` on success; failed runs remain under `tmp/<track>/` for diagnosis.

### Ecosystem split

- Benchmark ownership moved to `sdif-benchmarks`.
- Tree-sitter grammar ownership moved to `tree-sitter-sdif`.
- Core repository focused on specification, reference implementation, conformance fixtures, and documentation.
