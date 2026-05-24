---
title: "sdif-benchmarks"
sidebar_position: 3
---

# sdif-benchmarks

The `sdif-benchmarks` repository is a reproducible benchmark suite for evaluating SDIF against other structured data formats. It lives at [github.com/sdif-format/sdif-benchmarks](https://github.com/sdif-format/sdif-benchmarks).

## What It Measures

The suite focuses on evidence that is useful for AI-facing and deterministic workflows:

- **Token efficiency** — how many tokens a language model consumes when processing documents encoded in each format.
- **Context packing** — how many copies fit into fixed model-context budgets.
- **Round-trip fidelity** — whether a document survives a full encode/decode cycle without loss of information.
- **Mutation sensitivity** — how much token overhead is introduced by re-sending a mutated document.
- **Semantic fidelity** — whether relations, rules, tables, and scalar fields can be structurally recovered after conversion.
- **Operability** — whether a format has the capabilities needed for deterministic workflows, including canonical form, stable hashing, schema validation, native relations, and rule handling.
- **Retrieval accuracy** — optional LLM question-answering checks with deterministic validators.

## Formats Under Comparison

Benchmarks run across the following formats:

- **JSON** — ubiquitous but verbose, especially for repeated keys.
- **YAML** — compact for humans, but structurally ambiguous in some cases.
- **XML** — element-heavy; high overhead for LLM consumption.
- **TOON** — included as an optional additional point of comparison.
- **CSV Bundle** — CSV projection for table-heavy data.
- **SDIF** — canonical and source profiles.
- **SDIF AI projection** — the `.sdif.ai` form optimized for LLM token efficiency.

## How to Run

Clone the repository and follow the instructions in its README. The benchmarks are designed to be reproducible: inputs, expected outputs, and measurement methodology are all included in the repository.

```
git clone https://github.com/sdif-format/sdif-benchmarks
```

The suite expects access to the core `sdif` repository for the shared golden fixtures and reference implementation. By default it looks for that repo at `../sdif`; override with `SDIF_CORE_REPO`.

```bash
cd sdif-benchmarks
SDIF_CORE_REPO=../sdif python3 scripts/run_suite.py --only semantic --only ops
```

After cloning, refer to the repository's README for the full track list and environment switches.

## Interpreting Results

Results should be read in context. Token counts depend on the tokenizer used. Semantic-fidelity comparisons are most meaningful when the input data is equivalent across formats. Round-trip fidelity tests verify preservation through a conversion path; semantic-fidelity tests report recovery by axis; operability reports format capabilities rather than measured quality.

The benchmark suite does not publish a single performance number as a marketing claim. It is a tool for structured, reproducible comparison so that users can draw their own conclusions from the data.
