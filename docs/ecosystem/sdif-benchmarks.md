---
title: "sdif-benchmarks"
sidebar_position: 3
---

# sdif-benchmarks

The `sdif-benchmarks` repository is a reproducible benchmark suite for evaluating SDIF against other structured data formats. It lives at [github.com/sdif-format/sdif-benchmarks](https://github.com/sdif-format/sdif-benchmarks).

## What It Measures

The suite focuses on three dimensions of comparison:

- **Token efficiency** — how many tokens a language model consumes when processing documents encoded in each format.
- **Semantic density** — how much structured meaning is conveyed per token or per byte.
- **Round-trip fidelity** — whether a document survives a full encode/decode cycle without loss of information.

## Formats Under Comparison

Benchmarks run across the following formats:

- **JSON** — ubiquitous but verbose, especially for repeated keys.
- **YAML** — compact for humans, but structurally ambiguous in some cases.
- **XML** — element-heavy; high overhead for LLM consumption.
- **TOON** — included as an additional point of comparison.
- **SDIF** — canonical and source profiles.
- **SDIF AI projection** — the `.sdif.ai` form optimized for LLM token efficiency.

## How to Run

Clone the repository and follow the instructions in its README. The benchmarks are designed to be reproducible: inputs, expected outputs, and measurement methodology are all included in the repository.

```
git clone https://github.com/sdif-format/sdif-benchmarks
```

After cloning, refer to the repository's README for setup and execution steps. The suite is independent of the main `sdif` Python package but may use it for encoding/decoding SDIF documents during testing.

## Interpreting Results

Results should be read in context. Token counts depend on the tokenizer used. Semantic density comparisons are most meaningful when the input data is equivalent across formats. Round-trip fidelity tests verify that the canonical hash of a document matches before and after conversion.

The benchmark suite does not publish a single performance number as a marketing claim. It is a tool for structured, reproducible comparison so that users can draw their own conclusions from the data.
