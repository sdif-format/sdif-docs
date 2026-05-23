---
title: "Benchmark Your Data"
sidebar_position: 8
---

# Benchmark Your Data

The `sdif-benchmarks` repository contains an evidence-first benchmark suite that compares SDIF and SDIF AI against JSON Compact, JSON Pretty, YAML, XML, and TOON across token efficiency, context packing, round-trip fidelity, and delta compactness. You can run it against the shared corpus of canonical fixtures or add your own documents.

---

## 1. Clone the repository

```bash
git clone https://github.com/sdif-format/sdif-benchmarks
cd sdif-benchmarks
```

The suite expects the core SDIF repository to be present at `../sdif` by default. If you have it elsewhere, set `SDIF_CORE_REPO`:

```bash
export SDIF_CORE_REPO=/path/to/sdif
```

---

## 2. Install dependencies

```bash
pip install -e .
```

This installs the benchmark runners and shared helpers. The `sdif` CLI must also be installed and available on your `PATH`. See the [Install guide](./install.md) if it is not.

---

## 3. Add your own documents to the corpus

The shared corpus lives in `../sdif/examples/golden/`. Each fixture is a directory containing:

- `equivalent.json` — the canonical semantic source (benchmark input)
- `source.sdif` — the SDIF representation
- `canonical.sdif` — the canonical SDIF form
- `canonical.sha256` — hash evidence for the canonical form

To benchmark your own data, add a fixture directory following the same layout and point the benchmark at it:

```bash
export SDIF_BENCHMARK_GOLDEN_DIR=/path/to/your/fixtures
```

All formats (JSON, YAML, XML, SDIF, SDIF AI) are derived from `equivalent.json` at benchmark time, so the JSON file is the required starting point.

---

## 4. Run the benchmark tracks

Each benchmark track is available as a `make` target:

```bash
# Token reduction across formats
make benchmark-token

# How many document copies fit in fixed token budgets
make benchmark-context

# JSON→format→JSON round-trip fidelity
make benchmark-roundtrip

# Mutation sensitivity — re-send overhead after a change
make benchmark-delta

# Semantic quality checks (canonicalization, schema validation, round-trip)
make benchmark-quality

# LLM retrieval accuracy by format — requires an API key
SDIF_BENCHMARK_RETRIEVAL=1 ANTHROPIC_API_KEY=<key> make benchmark-retrieval
```

Results are written to the `results/` directory. Pass `SDIF_BENCHMARK_OUTPUT_DIR` to redirect output elsewhere:

```bash
SDIF_BENCHMARK_OUTPUT_DIR=/tmp/my-run make benchmark-token
```

---

## 5. Read the output

**Token efficiency** output ranks each format by median token ratio relative to JSON Compact (the stable baseline). A ratio below 1.0 means fewer tokens than JSON Compact. Example summary from the shared corpus across 21 documents:

| Format | Median ratio vs JSON Compact | Wins (out of 63 pairs) |
|---|---:|---:|
| SDIF AI | 56.8% | 57 |
| SDIF | 59.5% | 2 |
| YAML | 95.3% | 0 |
| JSON Compact | 100.0% | 0 |
| JSON Pretty | 137.3% | 0 |
| XML | 171.7% | 0 |

**Context packing** reports how many copies of each document fit inside fixed token budgets (4K, 8K, 32K, 128K).

**Round-trip fidelity** scores value, type, and structure preservation for the JSON→format→JSON path. SDIF AI and TOON are excluded from round-trip scoring because they are not intended for lossless JSON round-trip.

**Delta compactness** measures the token overhead of re-sending a document after a deterministic mutation to the first 10% of leaf values.

---

## 6. Token counting: what "tokens" means here

Token counts use the `cl100k_base` tiktoken encoding (the tokenizer used by OpenAI GPT-4 and related models) by default. This is the most widely used tokenizer for comparing format compactness across model families. The benchmark also supports optional TokenX estimation and Llama tokenizers:

```bash
SDIF_TIKTOKEN_ENCODING=cl100k_base   # default
SDIF_BENCHMARK_TOKENX=1              # enable TokenX estimation
SDIF_BENCHMARK_LLAMA=1               # enable Llama tokenizer
```

Any claim about token savings should name the tokenizer and corpus that produced it. The same document may produce different ratios under different tokenizers.

---

## 7. Quick token counting without the full benchmark

For a fast per-file token count without running the benchmark suite, use the `sdif tokens` command:

```bash
sdif tokens plan.sdif
```

This prints the byte size and estimated token count for a single document. It is useful for spot-checking a file before committing to a full benchmark run.

---

## 8. Interpreting results

Results depend on the corpus. SDIF's gains are most visible on data with repeated structure: wide tables with many rows, documents with many relations sharing the same predicates, or documents with long repeated field names. Flat documents with few repeated structures will show smaller differences.

The benchmark suite is designed to be reproducible. All format representations are derived from the same `equivalent.json` source, so differences in output measure format efficiency rather than differences in the underlying data.
