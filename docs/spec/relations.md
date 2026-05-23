---
title: "Relations"
sidebar_position: 7
---

# Relations

This page defines the normative rules for SDIF relation blocks.

Relations express directed triples — (subject, predicate, object) — that link named entities. They are distinct from scalar fields and table data and form a separate semantic layer within a document.

## Relation Block Syntax

A relation block begins with the keyword `rel:` on its own line (optionally preceded by a field key). It is followed by one or more triple lines, each indented by at least one level of whitespace.

```
rel:
  subject predicate object
  subject2 predicate2 object2
```

Each triple line MUST contain exactly three whitespace-separated tokens in the order: **subject**, **predicate**, **object**. A line within a `rel:` block that does not contain exactly three tokens MUST be rejected by the parser with an error.

## Triple Token Rules

Each of the three tokens in a triple MUST be one of the following:

- An **unquoted identifier** — a value matching the identifier grammar defined in [Lexical Structure](./lexical-structure.md#identifiers).
- A **double-quoted string** — a value enclosed in `"..."` using the quoted string escaping rules defined in [Lexical Structure](./lexical-structure.md#quoted-strings).

Tokens MUST be separated by one or more SP (U+0020) or HTAB (U+0009) characters. In canonical form, tokens MUST be separated by exactly one SP character.

Example with quoted string object:

```
rel:
  doc:invoice-42 has_status "pending"
  doc:invoice-42 assigned_to user:alice
```

## Multiple Relation Blocks

A single SDIF document MAY contain more than one `rel:` block. Parsers MUST merge all `rel:` blocks within a document into a single logical relation set. The position of a `rel:` block within the document does not affect the merged result.

Example:

```
rel:
  project:alpha depends_on project:beta

rel:
  project:alpha owned_by team:platform
```

These two blocks MUST be treated identically to:

```
rel:
  project:alpha depends_on project:beta
  project:alpha owned_by team:platform
```

## Canonical Ordering

In canonical form, all triples from a document's merged relation set MUST be emitted in a single `rel:` block. Triples MUST be sorted in ascending lexicographic order by **(subject, predicate, object)**, using UTF-8 byte ordering. The sort MUST be a stable, total order.

Specifically:

1. Triples are first sorted by the subject token (UTF-8 lexicographic).
2. Among triples with the same subject, they are sorted by the predicate token.
3. Among triples with the same subject and predicate, they are sorted by the object token.

This rule is normative and corresponds to [Canonicalization Rule 9](./canonicalization.md#rule-9--sort-relations-by-subject-predicate-object).

## Duplicate Triples

A triple is a duplicate if its subject, predicate, and object values are all identical (byte-for-byte) to another triple in the merged set. Duplicate triples SHOULD be deduplicated in canonical form. Parsers MUST NOT report an error on encountering duplicate triples in source form.

## Schema Validation of Relations

When a document references a schema (via the `schema` field), the schema MAY declare allowed relation predicates via the `relations[predicate, subject_type, object_type, required]:` table. See [Schemas](./schemas.md) for the full definition of that table.

When schema validation is performed:

- A triple whose predicate does not appear in the schema's `relations` table MUST be reported as a validation error.
- A triple whose subject or object does not conform to the declared `subject_type` or `object_type` MUST be reported as a validation error.
- A predicate declared with `required: true` MUST have at least one triple present in the document; its absence MUST be reported as a validation error.

Parsers MUST NOT reject a document solely because it contains relation triples when no schema is present. Schema validation is an optional, additive layer.

## AI Grouped Relation Syntax

The SDIF AI profile (see [SDIF AI](./sdif-ai.md)) defines an alternative grouped syntax for relation blocks:

```
rel[subject]:
  predicate object
  predicate2 object2
```

In this form, the subject is factored out of each triple line and declared once in the block header. Each indented line contains exactly two tokens: **predicate** and **object**.

This syntax MUST NOT appear in `@sdif` documents. Parsers for the standard SDIF profile MUST report a parse error if `rel[...]` syntax is encountered. The grouped syntax is valid exclusively in documents declared with the `@sdif.ai` header.

An `@sdif.ai` parser MUST treat `rel[subject]:` blocks as semantically equivalent to a `rel:` block containing one triple per indented line with the declared subject prepended.
