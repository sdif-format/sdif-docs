---
title: "Documents"
sidebar_position: 2
---

# Documents

An SDIF document is a plain-text file that encodes structured data as a sequence of named blocks. Each document has a declared type, a set of scalar fields, zero or more tables, optional relation triples, and optional validation rules. Everything in the file is human-readable and line-oriented — no binary encoding, no nesting syntax, no closing tags.

## Structure Overview

A document is made up of the following parts, each of which is optional except the header and the kind declaration:

1. **Header directive** — identifies the file as SDIF and specifies the version.
2. **Profile directive** (optional) — declares whether this is a source, canonical, or AI projection document.
3. **Kind declaration** — names the document type.
4. **Scalar fields** — flat key-value pairs.
5. **Tables** — repeating structured rows with named columns.
6. **Relations** (`rel:` block) — subject-predicate-object triples linking entities.
7. **Rules** (`rules:` block) — validation expressions applied to the document.
8. **Comments** — lines beginning with `#`, ignored by parsers.

These parts appear in order from top to bottom. There is no required ordering among scalar fields, tables, relations, and rules relative to each other, though by convention scalars come first and rules come last.

## The Header Directive

Every SDIF document begins with a header on its first non-blank, non-comment line:

```
@sdif 1.0
```

This line tells the parser that the file conforms to SDIF version 1.0. Documents that are AI projections use a different header:

```
@sdif.ai 1.0
```

The distinction matters: source and canonical documents are authoritative structured data, while AI projection documents contain AI-generated or AI-assisted content and carry a different trust level.

## The Kind Declaration

Immediately after the header (and any profile directive), the document declares its type with `kind`:

```
kind Plan
```

The kind is a bare identifier with an initial capital letter. It names the document type and determines which schema applies, what fields are expected, and how tools process the document. Every SDIF document must have exactly one `kind` declaration.

## Scalar Fields

Scalar fields are the simplest data in a document — a name and a value on one line:

```
id release.v2
title "Release validation plan"
status open
```

Fields may appear in any order after the kind declaration. Values can be unquoted identifiers, quoted strings, or triple-quoted multiline strings. See the [Fields](./fields.md) page for a full treatment.

## Tables

Tables hold repeating structured rows. The column header is declared once, and each row follows on its own indented line with values separated by literal tab characters:

```
milestones[id,status,gate]:
  R1	done	validate-syntax
  R2	done	validate-canonical
  R3	pending	validate-schema
```

See the [Tables](./tables.md) page for complete table syntax.

## Relations

The `rel:` block holds subject-predicate-object triples. Each triple links two identifiers through a named relationship:

```
rel:
  R3 depends_on R2
  R4 depends_on R3
```

Subject and object are identifiers that typically correspond to `id` values of rows or documents. Predicate is a bare identifier naming the relationship.

## Rules

The `rules:` block contains validation expressions written as s-expressions. Rules are evaluated by the validator when checking a document against its schema:

```
rules:
  (deny missing(id))
  (deny missing(status))
  (warn missing(title))
```

Each expression applies a named function to produce an error or a warning. See the [Validation](./validation.md) page for a full list of rule functions.

## Comments

Any line beginning with `#` is a comment and is ignored by the parser:

```
# This document tracks the v2 release validation gates.
kind Plan
```

Comments are stripped during canonicalization and do not affect hashing or comparison. They exist purely for human readers of the source file.

## Document Identity

By convention, every document has an `id` field that uniquely identifies it within its namespace. The `id` value is an identifier — no spaces, no special characters:

```
id release.v2.validation_plan
```

The id is used by canonicalization to order fields, by relations to reference entities, and by tools that track documents across versions. There is no enforcement mechanism that requires `id` to be globally unique, but schemas may declare it required.

## Encoding

SDIF documents are encoded in UTF-8. There is no byte-order mark. Line endings are LF (U+000A). Tools that encounter CRLF line endings should normalize them to LF before parsing.

## Source, Canonical, and AI Documents

A given piece of SDIF data may exist in up to three forms:

| Form | Header | Profile | Description |
|---|---|---|---|
| Source | `@sdif 1.0` | `@profile source` or none | Authored by humans, may have comments and flexible formatting |
| Canonical | `@sdif 1.0` | `@profile canonical-syntax-v1` | Deterministic byte sequence produced by `sdif canon` |
| AI projection | `@sdif.ai 1.0` | (typically none) | Generated or annotated by an AI assistant |

Source documents are what humans write. Canonical documents are what tools sign, hash, and compare. AI projection documents carry a separate header to signal that the content originated from a language model rather than direct human authorship. The [Headers](./headers.md) page describes these distinctions in more detail.

## Annotated Example

The following is a minimal but complete SDIF document showing all major parts:

```
@sdif 1.0
@profile source

# This plan tracks release validation gates.
kind Plan
id release.v2.validation_plan
schema example.plan.v1
title "Release v2 validation plan"
status open

milestones[id,status,gate,evidence]:
  R1	done	validate-syntax	reports/syntax.md
  R2	done	validate-canonical	reports/canonical.md
  R3	pending	validate-schema	

rel:
  R3 depends_on R2
  R2 depends_on R1

rules:
  (deny missing(id))
  (deny missing(status))
```

Reading top to bottom: the header declares SDIF 1.0, the profile marks this as a source document, a comment describes the purpose, the kind names this a `Plan`, scalar fields follow, a table records milestones (with one empty `evidence` cell for R3), a `rel:` block expresses dependencies, and a `rules:` block enforces that `id` and `status` are always present.
