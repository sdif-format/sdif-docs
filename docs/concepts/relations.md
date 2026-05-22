---
title: "Relations"
sidebar_position: 6
---

# Relations

Relations express connections between identifiers as subject-predicate-object triples. They are SDIF's primary mechanism for dependencies, governance, provenance, and traceability — without nesting objects inside objects.

## The `rel:` Block

A relations block starts with `rel:` and contains one triple per line, each indented by two spaces:

```
rel:
  R3 depends_on R2
  R4 depends_on R3
  release.v2.validation_plan validated_by validation.report.v2
```

Each triple has three parts:

| Part | Position | Description |
|---|---|---|
| Subject | First | The entity making the claim |
| Predicate | Second | The relationship type |
| Object | Third | The target entity or value |

All three parts are required on every line.

## Identifiers vs Quoted Strings

Subjects and predicates are always bare identifiers. Objects may be either identifiers or quoted strings:

```
rel:
  R3 depends_on R2
  milestone.R3 label "Validate schema milestone"
  release.v2 owned_by "Platform Team"
```

Quoted objects allow arbitrary string values, including spaces, punctuation, and phrases. Unquoted objects are identifiers that may refer to other documents or entities.

## Canonical Ordering

In canonical form, relations are sorted lexicographically by `(subject, predicate, object)` — in that priority order. This makes the canonical hash insensitive to the order in which relations were written in source documents.

Given:
```
rel:
  R4 depends_on R3
  R3 depends_on R2
  release.v2.validation_plan validated_by validation.report.v2
```

The canonical form will output:
```
rel:
  R3 depends_on R2
  R4 depends_on R3
  release.v2.validation_plan validated_by validation.report.v2
```

## Use Cases

Relations cover a range of practical needs without requiring schema changes or new table columns:

**Dependencies**

```
rel:
  R3 depends_on R2
  R4 depends_on R3
```

Milestone R4 cannot start until R3 is complete, and R3 depends on R2. The dependency graph is expressed as triples without modifying the `milestones` table schema.

**Validation evidence**

```
rel:
  release.v2.validation_plan validated_by validation.report.v2
```

Links the plan to the report that validates it. The predicate `validated_by` is user-defined; SDIF does not mandate a fixed vocabulary.

**Governance and ownership**

```
rel:
  release.v2 approved_by alice
  release.v2 approved_by bob
  release.v2 escalated_to "Platform Governance Committee"
```

Multiple triples with the same subject and predicate are allowed and common.

**Cross-document traceability**

```
rel:
  requirement.FEAT-42 implemented_by commit.abc1234
  commit.abc1234 tested_by test.run.2026-05-22
```

Subjects and objects do not need to be identifiers within the current document. They can be external identifiers that other tools resolve.

## Multiple `rel:` Blocks

A source document may contain multiple `rel:` blocks. The parser merges them. The canonical form always emits a single sorted `rel:` block.

## Dangling Relations

A relation is "dangling" if its subject or object identifier does not resolve to any known entity within the document. Whether dangling relations are an error depends on the schema:

```
rules:
  (deny dangling(rel))
```

Without this rule, dangling relations are permitted — they are useful for referencing external identifiers.

## Relations in the AI View: `rel[subject]:` Syntax

In `.sdif.ai` files, relations are grouped by subject to reduce repetition and improve readability for language models:

```
rel[R3]:
  depends_on R2

rel[R4]:
  depends_on R3

rel[release.v2.validation_plan]:
  validated_by validation.report.v2
```

This syntax is **AI-only**. It is never valid in source (`.sdif`) or canonical (`.sdif.canon`) files. Parsers that process AI projections expand grouped relations back into flat subject-predicate-object triples before any further processing.

See [SDIF AI](./sdif-ai) for full details on the AI projection format.
