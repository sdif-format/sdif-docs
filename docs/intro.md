---
title: "Introduction"
sidebar_label: "Introduction"
sidebar_position: 1
---

# Introduction

SDIF (Semantic Data Interchange Format) is a compact, semantic, canonicalizable data format designed for AI agents, deterministic machine workflows, and humans who need to audit structured data.

It combines:

- **JSON-style structure** — nested documents with typed fields
- **Tabular compactness** — repeated records as tab-separated rows without repeating keys
- **Semantic relations** — first-class triple support (`rel:`) for linking entities
- **Canonical form** — a deterministic byte representation suitable for hashing and signing
- **AI projections** — a derived, alias-friendly view optimized for large language model context windows

## Who is SDIF for?

| Audience | Why SDIF |
|---|---|
| AI agents | Compact input, reversible projections, semantic relations |
| Deterministic pipelines | Canonical form with stable SHA-256 hash |
| Human auditors | Readable source files, schema validation, structured diffs |
| Data engineers | Tabular compactness, JSON interop, schema enforcement |

## Three profiles

SDIF documents exist in three profiles, each with its own file extension:

| Profile | Extension | Purpose |
|---|---|---|
| Source | `.sdif` | Human-authored, readable, whitespace-flexible |
| Canonical | `.sdif.canon` | Deterministic bytes for hashing, signing, and comparison |
| AI projection | `.sdif.ai` | Compact derived view for model input, with optional field aliases |

The source profile is what humans write. The canonical profile is what machines compare. The AI projection is what gets sent to a language model.

## Quick example

Here is a minimal SDIF document describing a project plan:

```sdif
@sdif kind=Plan version=1.0
title: "Q3 Delivery Plan"
owner: "eng-team"

table milestones
  id	name	due	status
  m1	"Parser v1"	2024-07-01	done
  m2	"Canonical form"	2024-08-01	done
  m3	"Schema validation"	2024-09-01	in-progress

rel: m3 blocks m2
```

This document has two directives (`@sdif` and `table milestones`) and six statements (three key-value fields, one table body with two data rows, and one triple). The table header defines columns once; each row inherits those column names.

## Where to go next

- [Getting Started](./getting-started.md) — install the CLI and parse your first document
- [Why SDIF?](./why-sdif.md) — rationale, trade-offs, and format comparison
- [Spec](/docs/spec) — complete language reference
