---
title: "SDIF vs TOON"
sidebar_position: 8
---

# SDIF vs TOON

TOON is one of the formats included in the [sdif-benchmarks](https://github.com/sdif-format/sdif-benchmarks) comparison suite. It appears alongside JSON, YAML, XML, SDIF, and SDIF AI in the benchmark corpus.

## What the benchmarks cover

The sdif-benchmarks suite evaluates each format in the corpus across the same set of metrics:

- **Token efficiency** — token count per document when encoded with `cl100k_base` and other tokenizers.
- **Semantic density** — data content relative to structural overhead.
- **Round-trip fidelity** — whether conversion to and from the format preserves the canonical SDIF representation.

TOON is tested against these same metrics. The benchmarks apply consistent methodology across all formats: the same document corpus, the same tokenizers, and the same fidelity test (hash equality on the round-trip result).

## Where to find results

This documentation does not describe TOON's syntax or claim measured comparisons between TOON and SDIF. TOON's format properties and the measured benchmark results are available in the [sdif-benchmarks](https://github.com/sdif-format/sdif-benchmarks) repository, where results are organized by format and document.

For methodology details, see [Methodology](./methodology). For the metrics being compared, see [Token Efficiency](./token-efficiency), [Semantic Density](./semantic-density), and [Round-trip Fidelity](./roundtrip-fidelity).
