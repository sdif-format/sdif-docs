---
title: "SDIF vs JSON"
sidebar_position: 6
---

# SDIF vs JSON

JSON is the dominant interchange format for web APIs and one of the most widely supported data formats in existence. This comparison describes structural differences between JSON and SDIF that affect token efficiency, semantic density, and round-trip fidelity. It does not claim JSON is worse in general — the right format depends on the use case.

## Structural comparison

The most significant structural difference between JSON and SDIF for tabular data is key repetition.

In a JSON array of objects, each object carries all of its keys explicitly:

```json
[
  {"name": "Alice", "role": "admin", "active": true},
  {"name": "Bob",   "role": "user",  "active": true}
]
```

Every row repeats every key. A table with 12 columns and 500 rows repeats each of those 12 keys 500 times. The keys carry no new information after the first row — they are structural overhead that scales with row count.

SDIF writes column headers once and uses tab-delimited rows for all subsequent data:

```
table:users
name	role	active
Alice	admin	true
Bob	user	true
```

The headers appear exactly once regardless of how many rows follow. This is the primary source of token savings for tabular SDIF documents relative to JSON.

## Token cost of JSON syntax characters

Beyond key repetition, JSON object syntax carries per-row token costs: curly braces, colons, commas, and double-quoted strings each consume tokens. The `cl100k_base` tokenizer segments these characters differently than tab delimiters. SDIF rows use tab characters as field separators, which have lower per-field token cost than JSON object syntax.

## Relations: SDIF triples vs JSON nesting

SDIF has a native syntax for directed triples in `rel:` blocks. JSON has no equivalent — graph or relational data must be encoded using nested objects, arrays, or ad hoc conventions. Each level of JSON nesting adds braces, keys, and punctuation. For documents with substantial relational content, the cost difference between native SDIF triples and JSON-encoded graph structures can be significant.

## Canonicalization

SDIF has a normative canonical form. The `sdif canon` command produces a deterministic byte representation of any SDIF document. The `sdif hash` command computes a SHA-256 over that canonical form. Two semantically equivalent SDIF documents have the same hash.

Standard JSON has no canonical form. Two JSON documents that represent the same data may differ in key ordering, whitespace, number formatting, or unicode escaping. There is no standard mechanism to hash a JSON document in a way that two semantically equivalent documents would produce the same hash.

This difference matters for data integrity checks, caching, deduplication, and any workflow where you need to verify that two documents carry the same data.

## Schema

SDIF includes a built-in schema system. Type declarations, constraints, and relation signatures travel with the document as a first-class structural element. Validation is performed by the SDIF toolchain without a separate specification or external tool.

JSON Schema is a widely used but separate specification. It is not part of the JSON standard, requires a separate validator, and does not travel embedded within a JSON data document in a standard way.

## When JSON is the better choice

JSON is the right choice when:

- The consuming system already expects JSON and conversion overhead is not acceptable.
- Human readability with standard text editors is a priority.
- The data is not tabular — for example, deeply nested configuration structures where key repetition does not apply.
- Tooling availability is the deciding factor: JSON parsers exist in every language and environment.

## Interoperability

SDIF supports lossless conversion to and from JSON:

- `sdif to-json` — converts a canonical SDIF document to a JSON representation.
- `sdif from-json` — parses a JSON document and produces its canonical SDIF equivalent.

These commands support interoperability workflows where SDIF is used internally but JSON is required at an interface boundary. Round-trip fidelity properties are described in [Round-trip Fidelity](./roundtrip-fidelity).

## Current results

Measured token counts and byte sizes for the benchmark corpus across JSON and SDIF formats are available in the [sdif-benchmarks](https://github.com/sdif-format/sdif-benchmarks) repository.
