---
title: "Benchmarks"
sidebar_position: 1
---

# Benchmarks

This section compares SDIF and SDIF AI against other data interchange formats across three dimensions: token efficiency, semantic density, and round-trip fidelity.

## Purpose

SDIF is designed for AI agents and deterministic machine workflows. Token count and semantic density matter more than raw byte size when the consumer is a language model. These benchmarks provide a concrete, reproducible basis for comparing formats on those terms.

## Formats Compared

| Format | Description |
|---|---|
| SDIF | Source `.sdif` documents |
| SDIF AI | AI projection `.sdif.ai` |
| JSON Compact | Minified JSON (no extra whitespace) |
| JSON Pretty | Indented JSON (2-space) |
| YAML | Default YAML dump |
| XML | Standard XML serialization |
| TOON | TOON format |

## Metrics

- **Byte size** — raw UTF-8 byte count of the serialized document
- **Token count** — measured per tokenizer; primary results use `cl100k_base` (OpenAI-family models)
- **Semantic density** — tokens per semantic fact (field or relation)
- **Round-trip fidelity** — whether the format preserves data through a conversion cycle

## Status

Methodology is defined. A reproducible benchmark suite is available in the [sdif-benchmarks](https://github.com/sdif-format/sdif-benchmarks) repository. Results from that suite reflect the example corpus described in the [Methodology](./methodology) page.

## Limitations

- Benchmarks reflect a specific corpus of SDIF example documents. Results vary by document type, structure, and tokenizer.
- Not all semantic features transfer across formats; comparisons are best-effort projections.
- Token counts depend on the tokenizer. Results for non-OpenAI models may differ.
- Byte size alone is not a reliable proxy for model cost.

## Pages

- [Methodology](./methodology) — corpus, metrics, and serialization rules
- [Reproduce](./reproduce) — run the suite yourself
