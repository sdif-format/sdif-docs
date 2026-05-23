---
title: "Document Model"
sidebar_position: 4
---

# Document Model

An SDIF document is a sequence of blocks. This section defines the block types, their ordering constraints, and the rules governing document identity.

## Overview

Every SDIF document contains exactly one **document header**, exactly one **kind declaration**, and zero or more of the following block types: scalar fields, tables, relation blocks, and rule blocks. Blocks are separated by blank lines in source form and are parsed in the order they appear.

The block types recognized in SDIF 1.0 are:

| Block type | Syntax prefix | Cardinality |
|---|---|---|
| Profile directive | `@sdif` or `@sdif.ai` | Exactly one (required) |
| Profile qualifier | `@profile` | Zero or one |
| Kind declaration | `kind` | Exactly one (required) |
| Scalar field | `identifier SP value` | Zero or more |
| Table | `name[col1,...]:` | Zero or more |
| Relation block | `rel:` | Zero or more |
| Rule block | `rules:` | Zero or more |

## Document Header

The **document header** is a directive line that declares the SDIF format version.

- The `@sdif` or `@sdif.ai` directive MUST be the first non-blank, non-comment line in the document.
- The directive MUST be followed by a version token. In SDIF 1.0, the recognized version token is `1.0`.
- Parsers MUST reject documents in which the first non-blank, non-comment line is not a recognized `@sdif` or `@sdif.ai` directive.
- An optional `@profile` directive MAY appear on the line immediately following the header directive.
- The recognized profile values are `source` and `canonical-syntax-v1`. Parsers MUST treat an unrecognized profile value as a warning and MUST NOT reject the document solely on that basis.

Example:

```
@sdif 1.0
@profile source
```

Or, for AI-profile documents:

```
@sdif.ai 1.0
```

See [Lexical Structure — Directives](./lexical-structure.md#directives) for the general directive syntax rules.

## Kind Declaration

The **kind declaration** names the document type.

- A kind declaration MUST appear exactly once in every SDIF document.
- The kind declaration MUST be the first field-like line after the document header (and optional `@profile` qualifier). Comments and blank lines MAY appear between the header and the kind declaration without violating this rule; no other field-like line MAY precede it.
- The kind declaration consists of the keyword `kind` followed by a single space and a **TypeName** identifier.
- TypeName MUST be a valid identifier as defined in [Lexical Structure — Identifiers](./lexical-structure.md#identifiers).
- Parsers MUST report an error if the `kind` keyword is absent, appears more than once, or appears after any scalar field.

Grammar:

```
kind-declaration = "kind" SP TypeName NEWLINE
TypeName         = identifier
```

Example:

```
kind Plan
```

## Scalar Fields

**Scalar fields** associate a named identifier with a scalar value.

- A document MAY contain zero or more scalar fields.
- Each scalar field MUST occupy a single logical line of the form: `identifier SP value NEWLINE`, where `SP` is one or more space characters (U+0020) and `value` is one of the scalar value forms defined in [Scalar Values](./scalar-values.md).
- Field identifiers MUST conform to the identifier grammar in [Lexical Structure — Identifiers](./lexical-structure.md#identifiers).
- A multiline (triple-quoted) value extends across multiple physical lines; the logical field still begins with `identifier SP """` on its first line.
- Parsers MUST NOT require field names to be unique at the parse layer. Schema validation MAY enforce uniqueness for specific field names.

Grammar:

```
scalar-field    = identifier SP scalar-value NEWLINE
scalar-value    = unquoted-token | quoted-string | triple-quoted-string
```

Example:

```
id        task-42
title     "Refactor authentication module"
status    in-progress
due       2026-06-01
notes     """
Multi-line notes go here.
They are preserved verbatim.
"""
```

## Tables

**Tables** associate a named identifier with a rectangular grid of scalar values organized into named columns.

- A document MAY contain zero or more table blocks.
- Each table block MUST begin with a **table header line** of the form `name[col1,col2,...]:`.
- Table rows follow the header line and MUST be indented.
- The full table syntax is specified in [Tables](./tables.md).

## Relation Blocks

**Relation blocks** express RDF-style subject–predicate–object triples.

- A document MAY contain zero or more `rel:` blocks.
- Each `rel:` block begins with the literal `rel:` on its own line, followed by one or more triple lines. Each triple line MUST be indented and contain exactly three whitespace-separated tokens: `subject predicate object`.
- When a document contains multiple `rel:` blocks, parsers MUST merge all triples into a single canonical relation set. The blocks are logically equivalent to one combined block.
- Duplicate triples (identical subject, predicate, and object) MAY be deduplicated in canonical form.

Example:

```
rel:
  task-42 blocked-by task-39
  task-42 assigned-to alice
```

## Rule Blocks

**Rule blocks** contain constraint expressions evaluated against the document.

- A document MAY contain zero or more `rules:` blocks.
- Each `rules:` block begins with the literal `rules:` on its own line, followed by one or more rule expression lines. Each rule expression line MUST be indented.
- In SDIF 1.0, the recognized rule expression forms are `(deny expr)` and `(warn expr)`.
- The behavior of unrecognized rule expression forms is implementation-defined; implementations SHOULD emit a warning and SHOULD NOT silently succeed.

Example:

```
rules:
  (deny (missing id))
  (warn (eq status ""))
```

## Block Ordering

- In **source form**, scalar fields, table blocks, relation blocks, and rule blocks MAY appear in any order after the document header and kind declaration.
- In **canonical form**, blocks MUST appear in the following deterministic order: (1) document header and profile qualifier, (2) kind declaration, (3) scalar fields in lexicographic order by field name, (4) table blocks in lexicographic order by table name, (5) relation blocks merged into a single `rel:` block with triples in lexicographic order, (6) rule blocks.
- Parsers MUST accept any source-form ordering. Canonicalizers MUST produce the canonical ordering.

## Document Identity

By convention, the `id` field identifies an SDIF document uniquely within a namespace.

- The `id` field is a **convention**, not a parser-enforced constraint. Parsers MUST NOT reject a document that lacks an `id` field.
- If a schema declares `id` as a required field, the schema validator MUST enforce its presence and uniqueness within that schema's scope.
- The `id` field value SHOULD be a stable, unique token such as a URI fragment, UUID, or namespaced slug. The format of `id` values is not constrained by the SDIF 1.0 parser.
