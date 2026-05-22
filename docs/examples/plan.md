---
title: "Plan Example"
sidebar_position: 1
---

# Plan Example

## What this example shows

This example demonstrates a `Plan` document — a structured project planning artifact with scalar fields, ordered and unordered tables, a narrative block, dependency relations, and declarative validation rules.

Key concepts covered:

- `kind` declares the document type
- Scalar fields (`id`, `status`, `priority`, `owner`, etc.) appear as flat key-value pairs
- Two tables with different structure: `scope` (ordered, 2 columns) and `milestones` (unordered, 4 columns, primary key `id`)
- A `"""` narrative block for multi-line prose (`intent`)
- A `rel:` section with typed triples forming a `depends_on` chain
- Declarative `rules:` enforced by the validator

## JSON source

```json
{
  "kind": "Plan",
  "id": "release.v2.validation_plan",
  "schema": "example.plan.v1",
  "authority": "Canonical",
  "lifecycle": "Active",
  "created_at": "2026-05-20T18:00:00Z",
  "status": "open",
  "priority": "P0",
  "owner": "team.platform",
  "title": "Release v2 validation plan",
  "intent": "Define the minimum validation requirements for release v2.\nThe plan must remain auditable, reproducible, and easy to review.",
  "scope": [
    {"in": "schema validation", "out": "ui redesign"},
    {"in": "canonicalization", "out": "feature expansion"},
    {"in": "semantic relations", "out": "remote includes"},
    {"in": "validation reports", "out": "release automation"}
  ],
  "milestones": [
    {"id": "R1", "status": "done", "gate": "validate-syntax", "evidence": "reports/syntax.md"},
    {"id": "R2", "status": "done", "gate": "validate-canonical", "evidence": "reports/canonical.md"},
    {"id": "R3", "status": "pending", "gate": "validate-schema", "evidence": "reports/schema.md"},
    {"id": "R4", "status": "pending", "gate": "validate-semantics", "evidence": "reports/semantics.md"}
  ],
  "relations": [
    ["R3", "depends_on", "R2"],
    ["R4", "depends_on", "R3"],
    ["release.v2.validation_plan", "validated_by", "validation.report.v2"]
  ]
}
```

## SDIF

```
@sdif 1.0
@profile source
kind Plan
id release.v2.validation_plan
schema example.plan.v1
authority Canonical
lifecycle Active
created_at 2026-05-20T18:00:00Z
status open
priority P0
owner team.platform
title "Release v2 validation plan"

intent """
Define the minimum validation requirements for release v2.
The plan must remain auditable, reproducible, and easy to review.
"""

scope[in,out]:
  schema validation	ui redesign
  canonicalization	feature expansion
  semantic relations	remote includes
  validation reports	release automation

milestones[id,status,gate,evidence]:
  R1	done	validate-syntax	reports/syntax.md
  R2	done	validate-canonical	reports/canonical.md
  R3	pending	validate-schema	reports/schema.md
  R4	pending	validate-semantics	reports/semantics.md

rel:
  R3 depends_on R2
  R4 depends_on R3
  release.v2.validation_plan validated_by validation.report.v2

rules:
  (deny missing(evidence))
  (deny dangling(rel))
  (deny invalid(lifecycle))
  (warn eq(authority,Unknown))
```

## SDIF AI

The AI projection omits `@profile`, groups relations by subject, and strips narrative verbosity where possible.

```
@sdif.ai 1.0
kind Plan
id release.v2.validation_plan
status open
priority P0
owner team.platform

scope[in,out]:
  schema validation	ui redesign
  canonicalization	feature expansion
  semantic relations	remote includes
  validation reports	release automation

milestones[id,status,gate,evidence]:
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

## Canonical SDIF

Canonical form is produced by `sdif canon plan.sdif --schema schema.sdif`. It enforces deterministic field and table ordering per `canonical-syntax-v1`.

```
@sdif 1.0
kind Plan
authority Canonical
created_at 2026-05-20T18:00:00Z
id release.v2.validation_plan
intent """
Define the minimum validation requirements for release v2.
The plan must remain auditable, reproducible, and easy to review.
"""
lifecycle Active
owner team.platform
priority P0
schema example.plan.v1
status open
title "Release v2 validation plan"

milestones[id,status,gate,evidence]:
  R1	done	validate-syntax	reports/syntax.md
  R2	done	validate-canonical	reports/canonical.md
  R3	pending	validate-schema	reports/schema.md
  R4	pending	validate-semantics	reports/semantics.md

scope[in,out]:
  canonicalization	feature expansion
  schema validation	ui redesign
  semantic relations	remote includes
  validation reports	release automation

rel:
  R3 depends_on R2
  R4 depends_on R3
  release.v2.validation_plan validated_by validation.report.v2
```

## Hash

```bash
$ sdif hash plan.sdif --schema schema.sdif
sha256:a3f...  # deterministic over canonical UTF-8 bytes
```

The hash is stable across environments. If the document content or ordering changes, the hash changes.

## Notes

**`kind` and scalar fields**

The first line after `@profile source` is `kind Plan`. Every SDIF document has exactly one `kind`. Scalar fields follow directly — no wrappers, no nesting. Each field is a bare key-value pair separated by a single space (or a quoted string for multi-word values).

**Tables: `scope` and `milestones`**

Tables are declared with a column header on the same line as the table name, followed by indented tab-separated rows:

- `scope[in,out]` — ordered (row order matters), two columns, no primary key. Used for paired comparisons.
- `milestones[id,status,gate,evidence]` — unordered, four columns, with `id` as the primary key (declared in the schema). Rows can be referenced by their `id` value in `rel:` blocks.

Columns are separated by literal tab characters (`\t`), not spaces.

**Narrative block (`intent`)**

Triple-quoted strings (`"""..."""`) capture free-form prose. They preserve line breaks and are treated as a single string value. Use them for rationale, context, or descriptions that would be awkward as a single quoted line.

**Relations (`rel:`)**

Each line in `rel:` is a triple: `subject predicate object`. The `depends_on` chain (`R3 depends_on R2`, `R4 depends_on R3`) links milestone identifiers. The validator can check for dangling references and cycle detection via the `(deny dangling(rel))` rule.

**Declarative rules**

`rules:` contains s-expression constraints evaluated by the validator:

- `(deny missing(evidence))` — fails if any milestone row has an empty `evidence` field
- `(deny dangling(rel))` — fails if a relation references an unknown identifier
- `(deny invalid(lifecycle))` — fails if `lifecycle` is not in the schema-defined enum
- `(warn eq(authority,Unknown))` — emits a warning (not a failure) if `authority` is `Unknown`

## Try it locally

```bash
sdif parse plan.sdif
sdif canon plan.sdif --schema schema.sdif
sdif hash plan.sdif --schema schema.sdif
sdif to-json plan.sdif
sdif ai plan.sdif
```
