---
title: "Ecosystem"
sidebar_position: 1
---

# Ecosystem

The SDIF ecosystem consists of official repositories maintained under the [sdif-format](https://github.com/sdif-format) GitHub organization.

## Repositories

### sdif (core)

**Status: Stable**

The reference Python implementation. Provides the parser, CLI, canonicalizer, schema validator, JSON conversion, and AI projection. This is the primary package.

Install: `pip install sdif-format`

[Details](./sdif-core) · [GitHub](https://github.com/sdif-format/sdif)

---

### sdif-benchmarks

**Status: Available**

A reproducible benchmark suite that compares SDIF and SDIF AI against JSON Compact, JSON Pretty, YAML, XML, and TOON on token efficiency, semantic density, and round-trip fidelity.

[GitHub](https://github.com/sdif-format/sdif-benchmarks) · [Benchmarks docs](/docs/benchmarks/)

---

### tree-sitter-sdif

**Status: Available**

A Tree-sitter grammar for SDIF source documents. Enables syntax highlighting in editors and tools that support Tree-sitter grammars.

[GitHub](https://github.com/sdif-format/tree-sitter-sdif)

---

### sdif-docs

**Status: Active**

This documentation site.

[GitHub](https://github.com/sdif-format/sdif-docs)

---

## Roadmap

See the [Roadmap](./roadmap) page for planned work, in-progress items, and what is explicitly out of scope for v1.
