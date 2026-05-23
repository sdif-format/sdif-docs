---
title: "Canonicalization"
sidebar_position: 8
---

# Canonicalization

This page defines the normative **`canonical-syntax-v1`** contract for SDIF 1.0.

Canonicalization is the process of transforming a parsed SDIF document into a **deterministic, byte-for-byte reproducible** representation. Two documents that parse to the same SDIF AST under the same schema-aware canonicalization policy MUST produce identical canonical bytes and therefore identical hashes.

`canonical-syntax-v1` is syntax-level and structure-level. It does not perform semantic normalization of numerically or temporally equivalent values — for example, `1` and `1.0` produce different canonical bytes even if they represent the same quantity. See [Non-Goals for v1](#non-goals-for-v1) for the full list.

## Pipeline

Canonicalization proceeds in three stages:

```
Source bytes
    │
    ▼
Parse → AST
    │
    ▼
Canonical serializer → Canonical bytes
    │
    ▼
SHA-256 → Document hash
```

The canonical serializer operates on the **AST**, not on source bytes. Source-level formatting, comments, and blank lines have no effect on canonical output.

## Idempotency

The canonicalization function MUST be idempotent:

> `canon(canon(x))` MUST equal `canon(x)` for all valid SDIF documents `x`.

Implementations SHOULD include idempotency as a property in their test suites.

## Normative Rules

The following rules define `canonical-syntax-v1`. All rules are normative. Implementations that claim conformance to `canonical-syntax-v1` MUST implement all thirteen rules.

### Rule 1 — Normalize Line Endings

Implementations MUST normalize all CRLF sequences to LF during parsing, before any other processing. Canonical output MUST use LF exclusively. No CR character MUST appear in canonical bytes.

### Rule 2 — Emit UTF-8 with LF

Canonical output MUST be encoded in UTF-8. Canonical output MUST use LF (U+000A) as the sole line terminator. No BOM MUST be emitted.

### Rule 3 — Emit Trailing Newline

Canonical output MUST end with a single LF character. Documents that do not end with a newline MUST have one appended. Documents that end with multiple consecutive newlines MUST have excess newlines removed, leaving exactly one.

### Rule 4 — Remove Comments and Blank Trivia

Canonical output MUST NOT contain comments (lines starting with `#`, or inline `#` suffixes). Canonical output MUST NOT contain blank lines. All comment and blank-line trivia MUST be stripped.

### Rule 5 — Emit Directives in Deterministic Reserved Order

Directives MUST be emitted in the following fixed order when present:

1. `@sdif` (or `@sdif.ai` for AI-profile documents)
2. `@profile`
3. All other recognized directives, in lexicographic order by directive name
4. Unrecognized directives MUST NOT be emitted in canonical form

### Rule 6 — Emit Common Metadata Fields First

Within a document's top-level field list, fields that correspond to common metadata MUST be emitted before other fields. The reserved metadata field order is:

1. `kind`
2. `id`
3. `name`
4. `title`
5. `description`
6. `version`
7. `created_at`
8. `updated_at`

All other fields MUST follow in lexicographic order by key.

### Rule 7 — Two-Space Indentation for Child Blocks

Child block content MUST be indented with exactly **two spaces** (`  `, two U+0020 characters). Child blocks include:

- Table rows (indented under their `name[cols]:` header)
- Relation triples (indented under `rel:`)
- Rule expressions (indented under `rules:`)
- Narrative content (indented under their opening `"""`)

Implementations MUST NOT use tabs for indentation in canonical output (tabs are reserved for column separators within table rows only).

### Rule 8 — HTAB Separators in Table Rows

Within table rows, column values MUST be separated by a single literal HTAB character (U+0009). No other character or character sequence is a valid column separator in canonical form. Implementations MUST NOT substitute spaces or multiple characters for HTAB.

### Rule 9 — Sort Relations by (subject, predicate, object)

All triples within a `rel:` block MUST be emitted in ascending lexicographic order, sorted first by subject, then by predicate, then by object. The sort MUST be a stable, total order over UTF-8 strings.

### Rule 10 — Sort Rules by Source Expression

All entries within a `rules:` block MUST be emitted in ascending lexicographic order by their source expression string (the full `(deny/warn function(args))` text).

### Rule 11 — Sort Schema-Unordered Table Rows by Primary Key

Table row ordering in canonical form depends on schema availability:

| Condition | Canonical row order |
|---|---|
| No schema provided | Rows emitted in source order (preserved as-is) |
| Schema present, table has `ordered: true` | Rows emitted in source order (ordering is declared significant) |
| Schema present, table has `ordered: false` and a `primary_key` defined | Rows MUST be sorted in ascending lexicographic order by their primary key column value |
| Schema present, table has `ordered: false` and **no** `primary_key` defined | Implementations MUST report a **canonicalization error** and MUST NOT emit canonical output for this table |

Implementations MUST NOT silently drop or reorder rows in a way that does not conform to this policy.

### Rule 12 — Normalize Nested Narrative Indentation

Narrative blocks enclosed in `"""..."""` MUST have their content indentation normalized. The minimum indentation level across all non-empty content lines MUST be stripped as a common prefix. The resulting lines MUST then be re-indented to match the block's position in the document (two-space child indentation per Rule 7).

### Rule 13 — SHA-256 Hash Over Canonical UTF-8 Bytes

After canonical bytes are produced (Rules 1–12), implementations MUST compute a **SHA-256** hash over the exact canonical UTF-8 byte sequence. The hash MUST be represented as a 64-character lowercase hexadecimal string. This hash is the **document hash** and MUST be reproducible across all conforming implementations given the same source document.

## Schema-Aware Table Ordering — Detailed Policy

The three-case policy in Rule 11 requires clarification on error handling:

- **No schema**: The canonicalizer operates in schema-unaware mode. Row order is preserved from source. This is always valid.
- **`ordered: true`**: Row order is semantically significant (e.g., a time-series or priority list). The source order MUST be preserved. Reordering MUST NOT occur.
- **`ordered: false` + `primary_key`**: The canonicalizer MUST sort rows by the primary key column using UTF-8 lexicographic ordering. Numeric-looking values are treated as strings (no numeric normalization in v1).
- **`ordered: false` + no `primary_key`**: This is an error state. The canonicalizer MUST report a canonicalization error with the table name and the reason (`ordered=false requires primary_key for canonical ordering`). Partial canonical output MUST NOT be emitted for an erroring document.

## List Literal Preservation

:::note[Unreleased — fixed in next release]
Prior to this fix, `_quote_if_needed` in the reference implementation re-quoted list literals that contained a comma or inner double-quote (e.g. `[a,b,c]`, `["alpha","beta"]`), converting them from list literals into quoted strings. After `canon → parse`, the value became a string instead of a list — a semantic change, not normalization.

**Normative correction:** A list literal value (any value whose first character is `[` and last character is `]`) MUST be emitted as-is by the canonical serializer. The canonical serializer MUST NOT re-quote a list literal. `canon(parse(x)) = parse(x)` for list literal values must hold.

The affected `plan` golden fixture has been regenerated. If you implement the reference canonicalizer, update `_quote_if_needed` to short-circuit before the safe-identifier check for any `[…]`-shaped value.
:::

## Non-Goals for v1

The following transformations are explicitly **out of scope** for `canonical-syntax-v1`. Implementations MUST NOT perform these transformations as part of canonicalization:

- **Numeric normalization** — `1.0`, `1`, and `1.00` are distinct string values in v1.
- **Date-time zone normalization** — timestamps with different timezone offsets are not normalized to UTC.
- **Alias expansion** — AI-profile aliases are not expanded or resolved during canonicalization.
- **Semantic merge** — duplicate fields or relations are not deduplicated based on semantic equivalence.

These may be defined in future specification versions under a new `canonical-syntax-v2` contract.
