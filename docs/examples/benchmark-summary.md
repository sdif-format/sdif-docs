---
title: "Benchmark Summary Example"
sidebar_position: 5
---

# Benchmark Summary Example

## What this example shows

This example demonstrates SDIF describing itself — a `BenchmarkSummary` document that records the results of a token-efficiency comparison across data interchange formats.

Key concepts covered:

- SDIF is self-hosting: the same format used to exchange structured data is used to record benchmark results
- Scalar fields capture run metadata (`run_at`, `corpus`, `host`) without nesting
- A `results` table with five columns delivers a dense, machine-readable summary across formats
- Relations record the tokenizer used and the corpus that was measured, keeping provenance auditable
- The SDIF AI projection shows how the same information compresses further for model context windows

The `semantic_density` column is the ratio of information content to token count — the core metric tracked by the SDIF benchmark suite.

## SDIF

```
@sdif 1.0
@profile source
kind BenchmarkSummary
id benchmark.token_efficiency.20260520
schema sdif.benchmark_summary.v1
authority Canonical
lifecycle Active
run_at 2026-05-20T09:00:00Z
corpus sdif.corpus.representative.v1
host ci.runner.linux.x64

results[format,bytes,tokens,semantic_density,roundtrip]:
  sdif	1420	312	0.91	lossless
  sdif.ai	980	198	0.94	lossless
  json	3210	748	0.62	lossless
  yaml	2870	681	0.65	lossless
  toon	2150	510	0.70	lossless

rel:
  benchmark.token_efficiency.20260520 tokenized_by cl100k_base
  benchmark.token_efficiency.20260520 measured_on sdif.corpus.representative.v1
```

## SDIF AI

The AI projection drops `@profile`, provenance fields, and the schema declaration. Relations are grouped by subject using the `rel[subject]:` syntax.

```
@sdif.ai 1.0
kind BenchmarkSummary
id benchmark.token_efficiency.20260520
run_at 2026-05-20T09:00:00Z

results[format,bytes,tokens,semantic_density,roundtrip]:
  sdif	1420	312	0.91	lossless
  sdif.ai	980	198	0.94	lossless
  json	3210	748	0.62	lossless
  yaml	2870	681	0.65	lossless
  toon	2150	510	0.70	lossless

rel[benchmark.token_efficiency.20260520]:
  tokenized_by cl100k_base
  measured_on sdif.corpus.representative.v1
```

## Notes

**SDIF describing itself**

The `BenchmarkSummary` document is a natural fit for SDIF's own benchmark results. The `results` table is wide enough to be dense but narrow enough to remain readable. A JSON equivalent of the same document would use roughly 2.3x the tokens — a ratio visible in the `results` table itself.

**`results` table**

Five columns capture everything needed to reproduce or dispute a benchmark finding:

- `format` — the interchange format under test
- `bytes` — raw byte size of the representative payload in that format
- `tokens` — token count using the tokenizer named in `rel:`
- `semantic_density` — information-per-token ratio (higher is better); computed as the ratio of semantic content units to token count relative to the `sdif` baseline
- `roundtrip` — `lossless` if the format can represent and recover all semantic content; `lossy` if it cannot

**Relations**

Two predicates capture provenance without cluttering the scalar fields:

- `tokenized_by` — names the tokenizer used (e.g. `cl100k_base` for GPT-4-class models); results change if the tokenizer changes, so this is load-bearing
- `measured_on` — references the corpus identifier; the corpus defines what payload was used for each format, making results reproducible

**`sdif.ai` row**

The AI projection appears as its own row in `results`. This lets the benchmark answer the question "how much does the AI projection save?" without a separate document. At `0.94` semantic density and 198 tokens, `sdif.ai` is the densest representation in the table.

## Try it locally

```bash
# Parse the benchmark summary
sdif parse benchmark.sdif

# Convert to JSON for downstream tooling
sdif to-json benchmark.sdif

# Generate the AI projection from the source document
sdif ai benchmark.sdif

# Validate the summary against its schema
sdif validate benchmark.sdif --schema schema.sdif
```
