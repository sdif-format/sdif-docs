---
title: "Benchmarks"
sidebar_position: 1
---

# Benchmarks

This section compares SDIF and SDIF AI against other data interchange formats across multiple dimensions: token efficiency, context packing, round-trip fidelity, mutation sensitivity, semantic fidelity, operability, and optional retrieval accuracy.

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

- **Byte size** — raw UTF-8 byte count of the serialized document.
- **Token count** — measured per tokenizer; primary results use `cl100k_base` (OpenAI-family models).
- **Context packing** — how many copies of a document fit into fixed token budgets.
- **Round-trip fidelity** — whether structure, values, and types survive a conversion cycle.
- **Mutation sensitivity** — token overhead when re-sending a deterministically mutated document.
- **Semantic fidelity** — structural recovery of relations, rules, tables, and scalar fields after conversion.
- **Operability** — static capability flags for deterministic workflows: canonical form, stable hash, schema validation, native relations, rule declaration/evaluation, semantic type vocabulary, and deterministic output.
- **Retrieval accuracy** — optional LLM-answer quality track with deterministic validators, enabled only when configured.

## Status

Methodology is defined. A reproducible benchmark suite is available in the [sdif-benchmarks](https://github.com/sdif-format/sdif-benchmarks) repository. The suite writes per-track evidence under `results/<track>/` and a unified index under `results/index.*`. Results reflect the canonical golden corpus described in the [Methodology](./methodology) page.

## Limitations

- Benchmarks reflect a specific corpus of SDIF example documents. Results vary by document type, structure, and tokenizer.
- Not all semantic features transfer across formats; semantic-fidelity comparisons are best-effort projections and report unmeasured axes separately from zero recovery.
- Token counts depend on the tokenizer. Results for non-OpenAI models may differ.
- Byte size alone is not a reliable proxy for model cost.

## Pages

- [Methodology](./methodology) — corpus, metrics, and serialization rules
- [Reproduce](./reproduce) — run the suite yourself
