---
title: "Methodology"
sidebar_position: 2
---

# Methodology

This page describes how benchmarks are constructed, what is measured, and where the results are valid.

## Corpus

Benchmarks run against a set of SDIF example documents:

- `plan` — a project plan document using tables and relations
- `registry` — a multi-table registry with typed fields
- `schema` — a `kind Schema` document with field and type definitions
- `validation-report` — a validation result document with structured diagnostics

All source documents are `.sdif` files. Each is converted to every target format for comparison.

## Formats Compared

| Format | Serialization Rule |
|---|---|
| SDIF | Source `.sdif` as-is |
| SDIF AI | AI projection via `sdif ai` |
| JSON Compact | No extra whitespace; keys in insertion order |
| JSON Pretty | 2-space indentation |
| YAML | Default `yaml.dump()` output |
| XML | Standard element-per-field serialization |
| TOON | TOON format output |

## Metrics

### Byte Size

Raw UTF-8 byte count of the serialized document. No compression is applied. This reflects storage and transmission cost, not model cost.

### Token Count

Token counts are measured using the tokenizer specified for each result set. The primary tokenizer is `cl100k_base`, used by OpenAI GPT-4-family models. Results for other tokenizers are reported separately where available.

Token count is the primary metric for evaluating AI-facing cost.

### Semantic Density

Tokens per semantic fact. A semantic fact is one of:

- A field value in a table row
- A named relation triple

Lower is better. A format with fewer tokens per fact leaves more model capacity for reasoning rather than parsing overhead.

### Round-Trip Fidelity

Two round-trip paths are tested:

1. **JSON round-trip**: `JSON → SDIF → JSON`. Data is preserved if field values, types, and structure match after the round-trip.
2. **AI round-trip**: `SDIF → SDIF AI → SDIF`. Fidelity is verified by comparing the canonical SHA-256 hash of the source against the hash of the reconstructed document.

A format passes round-trip fidelity if either the data is fully preserved (JSON path) or the canonical hash matches (AI path).

## Tokenizers

Results are reported independently per tokenizer. Mixing results across tokenizers produces invalid comparisons.

| Tokenizer | Model family |
|---|---|
| `cl100k_base` | OpenAI GPT-4, GPT-3.5-turbo |

Additional tokenizers may be added in the benchmark suite over time.

## Serialization Rules

Serialization is applied consistently to avoid format-specific advantages from whitespace or formatting choices:

- **JSON Compact**: `json.dumps(obj, separators=(',', ':'))` — no extra whitespace
- **JSON Pretty**: `json.dumps(obj, indent=2)` — 2-space indentation
- **YAML**: `yaml.dump(obj)` — default PyYAML output
- **XML**: one element per field; attribute encoding where applicable
- **SDIF**: source document bytes as-is (no re-serialization)
- **SDIF AI**: output of `sdif ai <path>`

## Limitations

- **Corpus is small.** Four example documents do not cover all real-world document shapes. Results may not generalize.
- **Semantic projection is approximate.** JSON, YAML, and XML lack SDIF's relation and schema constructs. Cross-format conversions are best-effort.
- **Tokenizer coverage is partial.** Results reflect `cl100k_base`. Other model families may have different token boundaries.
- **No semantic normalization.** SDIF v1 canonicalization is syntax-level only. Numeric or date equivalences are not normalized and may inflate semantic density counts.
- **Byte size and token count diverge.** A format that is compact in bytes may be expensive in tokens. Both metrics are reported; neither alone is sufficient.
