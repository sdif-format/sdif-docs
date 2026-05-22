---
title: "Roadmap"
sidebar_position: 6
---

# Roadmap

This page describes what is implemented in v1.0, what exists in separate repositories, what is planned, what is under research, and what is explicitly out of scope for v1.

## Implemented (v1.0)

These features are stable and available in the `sdif` package.

- **Parser** — reads `.sdif` source documents; produces an AST
- **Canonical form** — deterministic byte representation under `canonical-syntax-v1`
- **Hash** — SHA-256 over canonical bytes; stable document identity
- **Schema validation** — validates documents against `kind Schema` documents
- **JSON conversion** — `to-json` and `from-json` with round-trip fidelity
- **AI projection** — `ai` and `from-ai` with hash-preserving round-trip
- **CLI** — `parse`, `canon`, `hash`, `tokens`, `to-json`, `from-json`, `ai`, `from-ai`, `validate`, `inspect`, `fmt`
- **Conformance fixtures** — valid and invalid document fixtures for grammar, canonicalization, and round-trip paths

## Available (Separate Repositories)

These are available now but maintained separately from the core package.

- **sdif-benchmarks** — reproducible benchmark suite comparing SDIF and SDIF AI against JSON, YAML, XML, and TOON ([repo](https://github.com/sdif-format/sdif-benchmarks))
- **tree-sitter-sdif** — Tree-sitter grammar for syntax highlighting in editors ([repo](https://github.com/sdif-format/tree-sitter-sdif))

## Planned

These are concrete near-term work items with a clear path to implementation.

- **VS Code extension** — syntax highlighting using the tree-sitter grammar
- **GitHub syntax highlighting** — Linguist registration for `.sdif` file detection
- **sdif-docs improvements** — additional examples, guides, and API reference

## Research

These are areas of active interest but without a committed design or timeline.

- **Remote includes and schemas** — referencing external SDIF documents by URL or hash
- **Digital signatures** — signing canonical bytes with an external key; verifying signatures
- **LSP (Language Server Protocol)** — diagnostics, hover, and completion for SDIF documents in editors

## Not Planned for v1

These are out of scope for v1 and will not be added without a separate versioned proposal.

- **Binary serialization** — SDIF is a text format; no binary wire encoding is planned
- **Query language** — SDIF is a data representation format, not a query system
- **Arbitrary code execution** — rules in SDIF are declarative constraints, not executable programs
