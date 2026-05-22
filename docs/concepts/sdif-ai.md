---
title: "SDIF AI"
sidebar_position: 11
---

# SDIF AI

The `.sdif.ai` format is a **derived projection** of an SDIF document, optimized for language model context. It is not an authoritative format — it carries no information that is not already present in the source or canonical form, and it must always be recoverable back to canonical SDIF without data loss.

## Purpose

Language models process tokens, and tokens cost money and context window. SDIF AI reduces both by:

- Replacing long field names and identifiers with short aliases
- Omitting fields whose values match schema defaults
- Grouping relations by subject to reduce repetition
- Placing tables before scalar fields when tables dominate the document

The same document becomes meaningfully shorter in `.sdif.ai` form without losing any information that a model needs to reason about its content or generate valid updates.

## Aliases

Aliases map verbose identifiers to short tokens. They are declared at the top of the AI file:

```
alias[k=kind,st=status,ev=evidence]
```

After this declaration, the rest of the file may use `k` in place of `kind`, `st` in place of `status`, and `ev` in place of `evidence`. Aliases apply to field names, column names, and predicate names.

Aliases are declared per-file and do not carry across documents. A parser recovering from AI format must expand aliases before emitting canonical SDIF.

You can create a projection with specific aliases from the CLI:

```bash
sdif ai plan.sdif --alias id=i --alias status=st
```

## Field Omission

When a schema is available and a field's value matches the schema default, the field may be omitted from the AI projection. For example, if the schema declares `status` with `default=open`, a document with `status open` does not need to emit that line in the AI view.

This requires the recovering parser to know the schema's defaults. The AI file records the schema identifier so the recovering tool can look it up.

## Table-First Ordering

In AI projections of table-heavy documents, tables appear before scalar fields. This makes the most information-dense content immediately visible to the model without reading through preamble.

## Grouped Relations: `rel[subject]:` Syntax

In source and canonical SDIF, relations are a flat list of triples under `rel:`. In AI projections, relations are grouped by subject:

```
rel[R3]:
  depends_on R2

rel[R4]:
  depends_on R3

rel[release.v2.validation_plan]:
  validated_by validation.report.v2
```

Each `rel[subject]:` block lists only the predicate and object for that subject. This avoids repeating the subject identifier on every line when a subject has many outgoing relations.

**This syntax is AI-only.** It is not valid in `.sdif` or `.sdif.canon` files. Parsers that accept AI projections expand grouped relations into flat triples before any further processing. Parsers that accept source or canonical files must reject `rel[subject]:` syntax.

## The `$` Type Marker

In AI projections, a column suffix `$` signals that the column's values are always strings, even when they look like numbers, booleans, or null:

```
checks[id,value$]:
  type-check	null
  count	42
  enabled	true
```

Without `$`, a recovering parser might infer types from cell content and misclassify `42` as an integer or `true` as a boolean. With `$`, the parser treats every cell in that column as a string literal.

This matters for round-trip correctness: if the original document has `value "42"` (a quoted string), the AI view must preserve that distinction.

## Round-Trip Guarantee

The defining property of SDIF AI is lossless round-trip recovery:

```
canonicalize(sdif_from_ai(ai_view(source))) == canonicalize(source)
```

In other words, starting from a source document:
1. Generate the AI projection (`ai_view`)
2. Recover the source from the projection (`sdif_from_ai`)
3. Canonicalize the result

The canonical bytes must be identical to the canonical bytes of the original source. This is the hash equivalence contract:

```
sdif_hash(source) == sdif_hash(sdif_from_ai(ai_view(source)))
```

If this equality does not hold, the AI projection is lossy and must not be used.

## What AI Projection Does Not Do

- It does not invent new information.
- It does not change field values or relations.
- It does not normalize semantics (the same restrictions as canonicalization apply).
- It does not replace the canonical form as the authoritative record.

Treat `.sdif.ai` files as ephemeral inputs for model consumption. The canonical `.sdif.canon` file is the truth.

## Example

Source document (`plan.sdif`):

```
@sdif 1.0
@profile source
kind Plan
id release.v2.validation_plan
schema example.plan.v1
title "Release v2 validation plan"
status open

milestones[id,status,gate,evidence]:
  R1	done	validate-syntax	reports/syntax.md
  R2	done	validate-canonical	reports/canonical.md
  R3	pending	validate-schema	reports/schema.md
  R4	pending	validate-semantics	reports/semantics.md

rel:
  R3 depends_on R2
  R4 depends_on R3
  release.v2.validation_plan validated_by validation.report.v2
```

AI projection (`plan.sdif.ai`), with aliases for `id` and `status`:

```
@sdif 1.0
@profile ai
alias[i=id,st=status]
kind Plan
i release.v2.validation_plan
schema example.plan.v1
title "Release v2 validation plan"

milestones[i,st,gate,evidence]:
  R1	done	validate-syntax	reports/syntax.md
  R2	done	validate-canonical	reports/canonical.md
  R3	pending	validate-schema	reports/schema.md
  R4	pending	validate-semantics	reports/semantics.md

rel[R3]:
  depends_on R2

rel[R4]:
  depends_on R3

rel[release.v2.validation_plan]:
  validated_by validation.report.v2
```

The `status open` field is omitted because `open` is the schema default. The `id` and `status` column names in the milestones header use their aliases. Relations are grouped by subject.

## CLI

```bash
# Generate AI projection from source
sdif ai plan.sdif

# Generate with explicit aliases
sdif ai plan.sdif --alias id=i --alias status=st

# Recover canonical SDIF from AI projection
sdif from-ai plan.sdif.ai

# Verify round-trip hash equivalence
sdif hash plan.sdif
sdif from-ai plan.sdif.ai | sdif hash -
```
