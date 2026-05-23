---
title: "Token Efficiency"
sidebar_position: 3
---

# Token Efficiency

Token efficiency measures how many tokens a serialized document consumes when passed to a language model. It is the primary cost metric for AI-facing data formats: a smaller token count leaves more of the context window available for reasoning, instructions, and other documents.

## What it measures

Token count is the number of tokens produced when a document is passed through a tokenizer. The primary tokenizer in the SDIF benchmarks is `cl100k_base`, which is used by OpenAI GPT-4-family models. Other tokenizers may segment text differently, so results are reported per tokenizer and should not be mixed.

Token count is distinct from byte size. A format may be compact in bytes but expensive in tokens — for example, formats that use many short repeated keys can inflate token count beyond what byte size alone suggests.

## Why it matters

LLM context windows have a fixed token budget. Every token spent on structural overhead (repeated keys, indentation, angle brackets) is a token not available for data content, instructions, or reasoning. For agents that process many records at once — or that operate under tight context limits — token efficiency directly affects what data can fit in a single inference call.

## How it's measured

For each document in the corpus, the benchmark:

1. Serializes the document to each target format according to the rules defined in [Methodology](./methodology).
2. Encodes the serialized bytes using `cl100k_base` (via the `tiktoken` library).
3. Records the total token count.

No compression is applied. Token counts reflect raw serialization, the same input a model would receive.

## Structural sources of token savings

SDIF is designed to reduce token overhead in tabular data through two main mechanisms.

**Column headers written once.** In a JSON array of objects, every row repeats every key as a string literal. A table with 10 columns and 100 rows repeats each key 100 times. SDIF writes column names once in the table header and omits them from each subsequent row. This saves proportionally more tokens as row count grows.

**Tab-delimited rows.** SDIF rows use tab characters as delimiters rather than JSON syntax characters (`{`, `}`, `:`, `,`, `"`). Delimiters themselves consume tokens; tab-delimited rows are structurally leaner than JSON object syntax.

**SDIF AI goes further.** The AI projection (`sdif ai`) produces an additional compact representation optimized for model consumption. It groups relations, omits fields that carry default or absent values, and uses abbreviated structural markers. For documents with dense relational content, SDIF AI is expected to be the most token-efficient format in the comparison set.

## Qualitative ranking expectations

Token efficiency is expected to track inversely with structural overhead. Formats that repeat keys, use deep indentation, or require verbose delimiters per field spend more tokens on structure.

| Format | Source of overhead |
|---|---|
| JSON Pretty | Key repetition per row + 2-space indentation |
| JSON Compact | Key repetition per row (no indentation savings) |
| YAML | Key repetition + explicit type markers |
| XML | Tag repetition per field (open and close) |
| SDIF | Headers once; tab-delimited rows |
| SDIF AI | Minimal structure; grouped relations |

This table describes structural properties, not measured results. Actual rankings depend on corpus characteristics.

## Limitations

- **Results depend on table density.** Documents with wide tables and many rows show the largest differences. Documents with few rows or deeply nested structures may show smaller gaps.
- **Tokenizer choice matters.** The cl100k\_base results do not predict results for other model families. Tokenizers segment whitespace, punctuation, and word pieces differently.
- **SDIF AI is not always applicable.** The AI projection is an output format, not a storage format. Round-trip guarantees apply only through `sdif from-ai`.
- **Byte size is not a reliable proxy.** A format that is smaller in bytes may not be cheaper in tokens. Both metrics are reported in [sdif-benchmarks](https://github.com/sdif-format/sdif-benchmarks).

## Current results

Measured token counts for the benchmark corpus are available in the [sdif-benchmarks](https://github.com/sdif-format/sdif-benchmarks) repository. Results are organized by document and tokenizer.
