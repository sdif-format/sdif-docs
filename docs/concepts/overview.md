---
title: "Concepts Overview"
sidebar_position: 1
---

# Concepts Overview

An SDIF document is a compact, semantically rich record designed for deterministic machine workflows and AI agents. Understanding its structure as a mental model makes the rest of the format click.

## Anatomy of an SDIF Document

Every SDIF document is composed of a small number of building blocks, always in this order:

### 1. Version Header

```
@sdif 1.0
```

The version header is mandatory and must be the first non-blank line. It declares the format version and governs parsing rules.

### 2. Profile Directive (optional)

```
@profile source
```

Declares which of the three SDIF profiles this file represents:

| Profile | Extension | Purpose |
|---|---|---|
| `source` | `.sdif` | Human-authored, may contain comments |
| `canonical` | `.sdif.canon` | Deterministic bytes, comment-free, stable hash |
| `ai` | `.sdif.ai` | Derived projection for AI agents, compact context |

If omitted, the file is treated as a source document.

### 3. Kind Declaration

```
kind Plan
```

Every SDIF document has exactly one kind. The kind is a capitalized identifier that names the type of record — `Plan`, `Schema`, `Report`, `Invoice`, and so on. Kinds are defined by schemas.

### 4. Scalar Fields

```
id release.v2.validation_plan
schema example.plan.v1
title "Release v2 validation plan"
status open
```

Scalar fields are simple key-value pairs, one per line. Values are unquoted when they contain no spaces or special characters, and double-quoted otherwise. Scalar fields come before tables and relations.

### 5. Compact Tables

```
milestones[id,status,gate,evidence]:
  R1	done	validate-syntax	reports/syntax.md
  R2	done	validate-canonical	reports/canonical.md
```

Tables pack structured, repeating data efficiently. The column header is declared once, then each row provides tab-separated values. This is the primary mechanism for lists, arrays, and structured collections in SDIF.

### 6. Relations

```
rel:
  R3 depends_on R2
  R4 depends_on R3
  release.v2.validation_plan validated_by validation.report.v2
```

Relations express subject-predicate-object triples. They connect identifiers across the document and to external identifiers, enabling dependency graphs, provenance, and governance links without embedding nested objects.

### 7. Rules (optional)

```
rules:
  (deny missing(evidence))
  (deny dangling(rel))
```

Rules are schema-level constraints evaluated at validation time. They express invariants over the document's data.

### 8. Schema (optional, in schema documents)

A `kind Schema` document describes the structure of another kind — its required fields, table layouts, column types, and relations. The schema drives validation and canonical ordering.

### 9. AI Projection (derived)

An `.sdif.ai` file is not authored directly. It is generated from a source or canonical SDIF document and carries aliases, omits default values, and groups relations by subject. See [SDIF AI](./sdif-ai) for details.

## Key Properties

**Canonical form is deterministic.** Given a source document and its schema, the canonical form produces identical bytes on every run, on every machine. This makes SHA-256 over canonical bytes a stable, signable document identity.

**Tables use literal tab characters.** Column values in table rows are separated by U+0009 HORIZONTAL TAB. This is not a convention — it is a format requirement.

**Relations are first-class.** Dependencies, governance links, and provenance are expressed as triples, not nested objects or embedded foreign keys.

**AI projection is derived, not authoritative.** The `.sdif.ai` file is always recoverable from canonical SDIF and must round-trip losslessly.

## What to Read Next

- [Tables](./tables) — the most important structural concept
- [Relations](./relations) — triples, ordering, and use cases
- [Canonicalization](./canonicalization) — deterministic bytes and hashing
- [SDIF AI](./sdif-ai) — compact AI-facing projections
