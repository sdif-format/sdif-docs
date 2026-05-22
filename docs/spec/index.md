---
title: "Specification"
sidebar_position: 1
---

# SDIF Specification

## Overview

This section defines the normative specification for **SDIF (Semantic Data Interchange Format) version 1.0**. The format version is independent of any library or tooling version.

| Property | Value |
|---|---|
| Format version | SDIF 1.0 |
| Status | Stable |
| Encoding | UTF-8 |
| MIME type | `application/sdif` (proposed) |
| Canonical extension | `.sdif.canon` |
| AI extension | `.sdif.ai` |

## Conformance Language

This specification uses the key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** as defined in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

## Scope

The SDIF 1.0 specification covers the following components:

- **Parser** — tokenization, directive recognition, block structure, and AST construction
- **AST** — the abstract syntax tree representing parsed SDIF documents
- **Schema validation** — type-checking fields, tables, columns, relations, and rule functions against a Schema document
- **Canonical syntax v1** — the deterministic serialization form (`canonical-syntax-v1`) used for reproducible storage and hashing
- **AI projection** — the compact, alias-enriched `.sdif.ai` form intended for language-model consumption

## Profiles

SDIF defines three distinct profiles, each with its own directive header and intended use:

| Profile | Directive | Extension | Purpose |
|---|---|---|---|
| Source | `@sdif 1.0` | `.sdif` | Human-authored, may include comments and flexible whitespace |
| Canonical | `@sdif 1.0` (with canonical serialization) | `.sdif.canon` | Deterministic, hashable, machine-produced |
| AI | `@sdif.ai 1.0` | `.sdif.ai` | Compact, alias-enriched projection for language models |

All three profiles share the same fundamental grammar. Canonical and AI profiles impose additional constraints defined in their respective sections.

## Specification Pages

- [Lexical Structure](./lexical-structure.md) — encoding, line endings, separators, comments, identifiers
- [Directives](./directives.md) — `@sdif`, `@sdif.ai`, and `@profile` directives
- [Document Model](./document-model.md) — `kind`, fields, tables, relations, rules, narratives
- [Scalar Values](./scalar-values.md) — string, integer, float, boolean, null, date, datetime
- [Tables](./tables.md) — HTAB-delimited table syntax and column types
- [Relations](./relations.md) — triple-style relation syntax
- [Schemas](./schemas.md) — Schema kind and validation model
- [Canonicalization](./canonicalization.md) — `canonical-syntax-v1` contract and pipeline
- [AI Projection](./sdif-ai.md) — `.sdif.ai` format and round-trip requirements
- [Conformance](./conformance.md) — test fixture layout and conformance requirements
- [Security](./security.md) — threat model and safe-handling guidance
