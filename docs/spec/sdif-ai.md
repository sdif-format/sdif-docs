---
title: "SDIF AI"
sidebar_position: 9
---

# SDIF AI

The **SDIF AI profile** is a compact, token-optimized projection of an SDIF document intended for consumption by language models. It preserves the semantic content of the source document while reducing token overhead.

SDIF AI documents are a **derived, read-only view**. They are not authoritative and MUST NOT be used as the source of record in place of the original `.sdif` file.

## Purpose

Language models incur token costs proportional to the length of their context. Full SDIF documents may include null-valued fields, default values, and verbose formatting that adds tokens without adding information relevant to a given task. The AI profile omits this content to produce a compact representation that round-trips back to canonical SDIF.

## Header

An SDIF AI document MUST begin with the `@sdif.ai` directive:

```
@sdif.ai 1.0
```

This directive MUST appear as the first non-blank, non-comment line of the file, in place of the standard `@sdif` header. A document that begins with `@sdif.ai` is an AI-profile document; a document that begins with `@sdif` is a standard document. The two header forms are mutually exclusive.

Parsers MUST reject any document that contains both `@sdif` and `@sdif.ai` directives.

## Generating an AI Document

AI-profile documents are produced by the `sdif ai` CLI command:

```
sdif ai <file.sdif>
```

This command reads a standard SDIF source file, applies the AI projection rules, and writes the result to stdout or to a file with the `.sdif.ai` extension by convention.

The projection rules applied during generation are:

- Fields whose value equals the schema-declared default MAY be omitted.
- Fields with a `null` value MAY be omitted.
- The source document hash (SHA-256 over canonical bytes) is embedded in the AI document to support verification.

## Reverting to Canonical SDIF

An AI document can be converted back to standard SDIF using:

```
sdif from-ai <file.sdif.ai>
```

This command reconstructs the canonical SDIF form from the AI projection.

## Round-Trip Contract

The following invariant MUST hold for any valid source document `S`:

```
canonicalize(from_ai(ai(S))) == canonicalize(S)
```

That is, generating an AI document and then reversing it MUST produce the same canonical form as directly canonicalizing the source. Implementations that produce AI documents MUST preserve enough information to satisfy this contract.

## Grouped Relation Syntax

AI-profile documents support a grouped `rel[subject]:` syntax that is more compact than the standard `rel:` form. In this syntax, the subject is declared once on the header line and all predicate–object pairs for that subject are listed beneath it:

```
rel[task-42]:
  blocked-by task-39
  assigned-to alice
  status in-progress
```

This is equivalent to the standard `rel:` triples:

```
rel:
  task-42 blocked-by task-39
  task-42 assigned-to alice
  task-42 status in-progress
```

The grouped `rel[subject]:` syntax is **only valid in `@sdif.ai` documents**. Parsers processing a standard `@sdif` document MUST reject this syntax and report a parse error. The motivation is that the grouped form saves tokens when a subject has many predicates, which is a common pattern in AI-facing projections.

## What May Be Omitted

In an AI-profile document, the following MAY be omitted relative to the source:

- Scalar fields whose value is `null`.
- Scalar fields whose value matches the default declared in the document's schema.
- Comments (always stripped; comments are not part of canonical form).
- Blank lines (always stripped).

Fields that carry non-default, non-null values MUST be preserved. The kind declaration MUST always be present.

## File Extension

The conventional file extension for AI-profile documents is `.sdif.ai`. Tooling SHOULD use this extension to distinguish AI projections from source documents. This extension is a convention only; parsers MUST use the header directive to determine document type, not the file extension.

## Derived Status

SDIF AI documents are a read-only, derived representation.

- AI documents MUST NOT be committed to version control as the authoritative source of an SDIF record.
- If a language model modifies content when processing an AI document, the modification MUST be applied to the original `.sdif` source, not to the `.sdif.ai` file.
- The embedded source hash enables verification that an AI document corresponds to a specific canonical source revision. Implementations MAY surface a warning if the hash does not match the current canonical form of the referenced source file.
