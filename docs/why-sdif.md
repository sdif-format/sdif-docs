---
title: "Why SDIF?"
sidebar_position: 3
---

# Why SDIF?

SDIF was designed around a specific set of constraints that existing formats do not fully satisfy together. This page explains those constraints, what SDIF optimizes for, and where it is not the right tool.

## The problem

### JSON repeats keys in arrays of objects

JSON arrays of objects are common and readable, but each object carries its full set of keys. For a table with 10 columns and 1000 rows, that means 10,000 key repetitions in the serialized form. For large context windows, this overhead is directly measurable in tokens.

```json
[
  {"id": "m1", "name": "Parser v1", "due": "2024-07-01", "status": "done"},
  {"id": "m2", "name": "Canonical form", "due": "2024-08-01", "status": "done"}
]
```

SDIF defines the column names once in the table header and uses tab-separated rows for the data.

### YAML has ambiguity that hurts deterministic workflows

YAML supports multiple representations of the same value (`true`, `yes`, `on` are all boolean true in YAML 1.1). String/number inference is implicit and context-dependent. Two YAML parsers may produce different in-memory representations of the same file. This ambiguity makes YAML unsuitable as a canonical interchange format.

### CSV loses structure and semantics

CSV is compact for tabular data, but it carries no type information, no nested structure, no metadata, no schema reference, and no semantic relations. A CSV file cannot express that two rows are related or that a field is a date rather than a string.

### TOON is excellent for compact JSON-shaped data; SDIF targets a broader semantic and canonical layer

TOON (Terse Object Notation) is an efficient format for JSON-shaped data without key repetition. SDIF shares that goal for tabular data but adds semantic relations, a versioned canonical form, schema validation, and AI projections. If your data is purely JSON-shaped and you do not need those features, TOON may be the right choice.

## What SDIF optimizes for

- **Compact repeated records** — table blocks define column names once; rows contain only values
- **Human-auditable source files** — `.sdif` source is readable, writable by hand, and reviewable in diffs
- **Machine-deterministic canonical form** — `.sdif.canon` is a stable byte sequence suitable for hashing and signing
- **Semantic relations** — `rel:` triples link entities within and across documents
- **Validation with schemas** — documents can declare a schema and be validated against it
- **Hashing and signing** — the canonical form enables content-addressed storage and cryptographic signing
- **AI-facing projections** — `.sdif.ai` provides alias-compressed, lossy-optional views for model context windows

## What SDIF is not

- **Not a general replacement for JSON.** JSON remains the right choice for public APIs, configuration consumed by third-party tools, and any context where human ecosystem compatibility matters more than compactness.
- **Not a config language like YAML.** SDIF does not support anchors, aliases, multi-document streams, or implicit type coercion. It is a data interchange format, not a configuration DSL.
- **Not only a token compression trick.** Compactness is one property, not the purpose. Schemas, canonical hashes, semantic relations, and AI projections are first-class goals.
- **Not a binary serialization format.** SDIF source and canonical files are UTF-8 text. There is no binary encoding.

## When to use SDIF

SDIF is well-suited for:

- **Semantic registries** — catalogs of entities with typed relations between them
- **Structured plans** — project plans, roadmaps, and milestone tracking with tabular milestones and relational dependencies
- **Policy documents** — rule sets that need validation, versioning, and canonical hashing
- **Validation reports** — structured output from validation pipelines, with schema references and per-row results
- **Evidence manifests** — auditable records of what data was present at a given time, suitable for signing
- **Agent-to-agent data exchange** — compact, reversible data passed between AI agents with AI projection support

## When not to use SDIF

Prefer a different format when:

- **Large binary blobs** — SDIF is UTF-8 text; binary data requires base64 encoding or external references
- **High-frequency telemetry** — per-event logs at high throughput are better served by Parquet, Avro, or a time-series store
- **Long literary documents** — prose documents without significant structure get no benefit from SDIF
- **Existing JSON public APIs** — if consumers expect JSON, emit JSON; do not force format conversion at the API boundary

## Comparison summary

| Format | Compact tables | Canonical form | Semantic relations | Schemas | AI projections |
|---|---|---|---|---|---|
| JSON | — | — | — | — | — |
| YAML | — | — | — | — | — |
| CSV | ✓ | — | — | — | — |
| TOON | ✓ | — | — | — | — |
| SDIF | ✓ | ✓ | ✓ | ✓ | ✓ |
