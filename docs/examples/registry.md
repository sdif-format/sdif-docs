---
title: "Registry Example"
sidebar_position: 2
---

# Registry Example

## What this example shows

This example demonstrates a `Registry` document — a catalog of tracked artifacts with a dense multi-column table, governance relations, and rules that enforce evidence completeness.

Key concepts covered:

- `Registry` kind for tracking and auditing named artifacts
- A 6-column `entries` table suited for dense, structured data
- Governance relations using `governed_by`, `validated_by`, and `emits`
- Rules that check for missing evidence across all entries

## SDIF

```
@sdif 1.0
@profile source
kind Registry
id example.registry
schema example.semantic_registry.v1
authority Canonical
lifecycle Active

entries[id,kind,lifecycle,authority,path,evidence]:
  example.schema	Schema	Active	Canonical	schemas/example.schema.sdif	reports/schema.md
  example.registry	Registry	Active	Canonical	registry/example.registry.sdif	reports/registry.md
  validator.core	Tool	Active	Canonical	tools/validator.md	reports/validator.md

rel:
  example.registry governed_by example.schema
  example.registry validated_by validator.core
  validator.core emits reports/validator.md

rules:
  (deny missing(entries.evidence))
  (deny dangling(rel))
  (deny invalid(entries.lifecycle))
```

## JSON source

```json
{
  "sdif": "1.0",
  "profile": "source",
  "kind": "Registry",
  "id": "example.registry",
  "schema": "example.semantic_registry.v1",
  "authority": "Canonical",
  "lifecycle": "Active",
  "entries": [
    {
      "id": "example.schema",
      "kind": "Schema",
      "lifecycle": "Active",
      "authority": "Canonical",
      "path": "schemas/example.schema.sdif",
      "evidence": "reports/schema.md"
    },
    {
      "id": "example.registry",
      "kind": "Registry",
      "lifecycle": "Active",
      "authority": "Canonical",
      "path": "registry/example.registry.sdif",
      "evidence": "reports/registry.md"
    },
    {
      "id": "validator.core",
      "kind": "Tool",
      "lifecycle": "Active",
      "authority": "Canonical",
      "path": "tools/validator.md",
      "evidence": "reports/validator.md"
    }
  ],
  "relations": [
    ["example.registry", "governed_by", "example.schema"],
    ["example.registry", "validated_by", "validator.core"],
    ["validator.core", "emits", "reports/validator.md"]
  ],
  "rules": [
    "(deny missing(entries.evidence))",
    "(deny dangling(rel))",
    "(deny invalid(entries.lifecycle))"
  ]
}
```

## SDIF AI

```
@sdif.ai 1.0
kind Registry
id example.registry
lifecycle Active

entries[id,kind,lifecycle,authority,path,evidence]:
  example.schema	Schema	Active	Canonical	schemas/example.schema.sdif	reports/schema.md
  example.registry	Registry	Active	Canonical	registry/example.registry.sdif	reports/registry.md
  validator.core	Tool	Active	Canonical	tools/validator.md	reports/validator.md

rel[example.registry]:
  governed_by example.schema
  validated_by validator.core

rel[validator.core]:
  emits reports/validator.md
```

## Notes

**`Registry` kind**

A `Registry` document acts as a catalog: it records which artifacts exist, what kind they are, their lifecycle state, and where their evidence lives. Unlike a `Plan` (which tracks work to be done), a `Registry` tracks what already exists and who governs it.

**6-column `entries` table**

The `entries` table uses six columns — `id`, `kind`, `lifecycle`, `authority`, `path`, `evidence` — packed with tab-separated values. Wide tables like this work well in SDIF because the column header on the first line makes the structure self-describing without requiring JSON verbosity.

Each row represents one tracked artifact. The `id` column doubles as a stable identifier that can be referenced in `rel:` triples.

**Governance relations**

Three relation predicates appear here:

- `governed_by` — declares which schema or policy document governs this registry
- `validated_by` — names the tool or process that validated entries
- `emits` — links a tool to its output path (a `Path`-typed object)

These triples make governance auditable: any reader can follow the chain from a registry entry back to the schema and the validation report.

**Rules: enforcing evidence completeness**

`(deny missing(entries.evidence))` targets a specific column (`evidence`) within a named table (`entries`). This is more precise than checking top-level fields — the validator applies the constraint row-by-row across the table. An entry without a filled `evidence` field causes a validation failure.

## Try it locally

```bash
sdif parse registry.sdif
sdif to-json registry.sdif
```
