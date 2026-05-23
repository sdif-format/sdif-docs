---
title: "Round-trip Fidelity"
sidebar_position: 5
---

# Round-trip Fidelity

Round-trip fidelity measures whether information survives a conversion cycle intact. For SDIF, a round-trip means serializing a document to another format and converting it back, then verifying that the result is semantically equivalent to the original. A format that loses data, reorders triples, or silently coerces types on round-trip is not safe to use as an interchange layer.

## What it measures

Fidelity is not about preserving bytes — it is about preserving meaning. Two SDIF documents are considered equivalent if they produce the same canonical form, which means:

- Every scalar field in every table row is present and unchanged.
- Every relation triple (subject, predicate, object) is present in the canonical relation set.
- Every narrative block is preserved character-for-character.
- Schema type and constraint declarations survive unchanged.

The strongest fidelity test is hash equality: `sdif hash` computes a SHA-256 over the canonical byte representation of a document. If the hash of the restored document matches the hash of the original, the round-trip is lossless by definition.

## JSON round-trip

The SDIF CLI supports JSON interoperability through two commands:

- `sdif to-json` — serializes a canonical SDIF document to a JSON representation.
- `sdif from-json` — parses a JSON document and reconstructs the canonical SDIF equivalent.

A correct round-trip satisfies: `from_json(to_json(source))` produces a document canonically equivalent to `source`. The benchmark suite tests this property against a corpus of documents and reports whether hash equality holds.

## SDIF AI round-trip

The AI projection (`sdif ai`) produces a compacted representation intended for model consumption. It is not a storage format and cannot be read as canonical SDIF. The inverse command `sdif from-ai` reconstructs canonical SDIF from the AI projection.

A correct SDIF AI round-trip satisfies: `sdif_hash(source) == sdif_hash(from_ai(ai(source)))`. This is the same hash-equality test as the JSON round-trip, applied to a different conversion path.

:::note[Unreleased — benchmark results after next release]
**SDIF AI reaches 100% round-trip fidelity** across all 20 benchmark documents after two fixes: the `$`-column decoder now honours `Table.quoted_columns` when expanding AI projections, and the canonicalizer no longer re-quotes list literals. Canonical SDIF also remains at 100%. The benchmark evidence is updated in `sdif-benchmarks`.
:::

## Known edge cases

Several structural differences between SDIF and JSON create conditions where naive conversion can fail.

**Relation ordering.** SDIF relations are a set: they are deduplicated and sorted canonically. JSON arrays are ordered sequences. A JSON-to-SDIF conversion that preserves JSON array order but ignores SDIF deduplication rules may produce a different canonical hash. Correct converters normalize relation order during import.

**Null cell handling.** SDIF tables distinguish between an absent value and an explicit null. JSON also has `null`, but JSON objects may simply omit a key, which is not the same as an explicit null. Round-trip converters must apply consistent rules for this distinction.

**Triple-quoted narrative blocks.** SDIF supports multi-line narrative fields delimited with triple-quoted syntax. JSON strings use escape sequences for newlines. A round-trip that converts through JSON must correctly encode and decode newlines, carriage returns, and any characters that JSON requires to be escaped.

**Scalar ambiguity in `$`-suffixed columns.** In SDIF AI projections, a `$` suffix on a column name signals that all cells in that column are strings, even if their content looks like a typed literal (integers, booleans, `null`). After alias expansion strips the `$` suffix, a decoder that does not consult `Table.quoted_columns` will coerce `"200"` to the integer `200`, breaking the round-trip. Correct decoders must propagate `quoted_columns` through the expansion step. *(Fixed in the next release of the reference implementation.)*

## How the benchmarks test fidelity

For each document in the corpus, the benchmark:

1. Converts the source SDIF document to the target format using the appropriate CLI command.
2. Converts the result back to SDIF using the corresponding inverse command.
3. Computes `sdif hash` on the restored document.
4. Compares the hash against the hash of the canonical source.

Pass or fail is binary: the hashes either match or they do not. The benchmark reports pass rate across the corpus and flags any documents where fidelity fails, along with which edge case class the failure belongs to.

## Limitations

- **JSON round-trip depends on converter correctness.** Fidelity results reflect the specific version of `sdif to-json` and `sdif from-json` tested. A third-party JSON representation of SDIF may not satisfy the same guarantees.
- **Corpus coverage matters.** A corpus that does not include documents with multi-line narratives, null cells, or dense relation sets may not exercise the failure modes described above.
- **SDIF AI is not a general-purpose serialization.** Round-trip fidelity via `sdif ai` / `sdif from-ai` is defined and tested, but this path is intended for AI consumption workflows, not for archival or exchange.

Measured fidelity results for the benchmark corpus are available in the [sdif-benchmarks](https://github.com/sdif-format/sdif-benchmarks) repository.
