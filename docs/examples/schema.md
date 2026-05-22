---
title: "Schema Example"
sidebar_position: 3
---

# Schema Example

## What this example shows

This example demonstrates a `Schema` document — a machine-readable contract that defines the structure, types, and allowed relations for another document kind. The validator uses a schema to check conformance of any document that declares `schema example.plan.v1`.

Key concepts covered:

- `Schema` kind validates other SDIF documents
- `for_kind` links this schema to a specific document kind (`Plan`)
- `fields[]` table: declares scalar field names, types, required status, and defaults
- `tables[]` table: declares named tables, whether they are ordered, and their primary key
- `columns[]` table: per-column constraints for each declared table
- `relations[]` table: allowed predicates, their subject and object types, and whether they are required
- `rule_functions[]` table: names and arity of functions that can appear in `rules:` blocks
- Type vocabulary: `Identifier`, `String`, `Path`, `Enum(...)` variants

## JSON source

```json
{
  "kind": "Schema",
  "id": "example.plan.v1",
  "schema": "sdif.schema.v1",
  "authority": "Canonical",
  "lifecycle": "Active",
  "for_kind": "Plan",
  "fields": [
    {"name": "kind", "type": "Identifier", "required": true, "default": null},
    {"name": "id", "type": "Identifier", "required": true, "default": null},
    {"name": "schema", "type": "Identifier", "required": true, "default": null},
    {"name": "authority", "type": "Enum(Canonical,Reference,Working,Derived,External,Unknown)", "required": false, "default": "Unknown"},
    {"name": "lifecycle", "type": "Enum(Draft,Active,Deprecated,Superseded,Archived,Quarantined)", "required": false, "default": "Draft"},
    {"name": "title", "type": "String", "required": true, "default": null},
    {"name": "status", "type": "Enum(open,closed,blocked)", "required": true, "default": "open"},
    {"name": "priority", "type": "Enum(P0,P1,P2,P3)", "required": false, "default": "P2"}
  ],
  "tables": [
    {"name": "milestones", "ordered": false, "primary_key": "id"},
    {"name": "scope", "ordered": true, "primary_key": null}
  ],
  "columns": [
    {"table": "milestones", "name": "id", "type": "Identifier", "required": true},
    {"table": "milestones", "name": "status", "type": "Enum(done,pending,blocked)", "required": true},
    {"table": "milestones", "name": "gate", "type": "Identifier", "required": false},
    {"table": "milestones", "name": "evidence", "type": "Path", "required": false},
    {"table": "scope", "name": "in", "type": "String", "required": true},
    {"table": "scope", "name": "out", "type": "String", "required": true}
  ],
  "relations": [
    {"predicate": "depends_on", "subject_type": "Identifier", "object_type": "Identifier", "required": false},
    {"predicate": "validated_by", "subject_type": "Identifier", "object_type": "Identifier", "required": false}
  ],
  "rule_functions": [
    {"name": "deny", "min_args": 1, "max_args": 1},
    {"name": "warn", "min_args": 1, "max_args": 1},
    {"name": "missing", "min_args": 1, "max_args": 1},
    {"name": "dangling", "min_args": 1, "max_args": 1},
    {"name": "invalid", "min_args": 1, "max_args": 1},
    {"name": "eq", "min_args": 2, "max_args": 2}
  ]
}
```

## SDIF

```
@sdif 1.0
kind Schema
id example.plan.v1
schema sdif.schema.v1
authority Canonical
lifecycle Active
for_kind Plan

fields[name,type,required,default]:
  kind	Identifier	true	null
  id	Identifier	true	null
  schema	Identifier	true	null
  authority	Enum(Canonical,Reference,Working,Derived,External,Unknown)	false	Unknown
  lifecycle	Enum(Draft,Active,Deprecated,Superseded,Archived,Quarantined)	false	Draft
  title	String	true	null
  status	Enum(open,closed,blocked)	true	open
  priority	Enum(P0,P1,P2,P3)	false	P2

tables[name,ordered,primary_key]:
  milestones	false	id
  scope	true	null

columns[table,name,type,required]:
  milestones	id	Identifier	true
  milestones	status	Enum(done,pending,blocked)	true
  milestones	gate	Identifier	false
  milestones	evidence	Path	false
  scope	in	String	true
  scope	out	String	true

relations[predicate,subject_type,object_type,required]:
  depends_on	Identifier	Identifier	false
  validated_by	Identifier	Identifier	false
  governed_by	Identifier	Identifier	false
  emits	Identifier	Path	false

rule_functions[name,min_args,max_args]:
  deny	1	1
  warn	1	1
  missing	1	1
  dangling	1	1
  invalid	1	1
  unknown	1	1
  eq	2	2
```

## Notes

**`for_kind Plan`**

This scalar field links the schema to exactly one document kind. When a document declares `schema example.plan.v1`, the validator loads this schema and applies it. Documents with `kind Plan` and no declared schema are validated permissively (structure only, no type or enum checking).

**`fields[]` table**

Each row defines one top-level scalar field:

- `name` — the field identifier
- `type` — one of `Identifier`, `String`, `Path`, or `Enum(val1,val2,...)`
- `required` — `true` means the field must be present; `false` means it is optional with a default
- `default` — the value used when the field is absent; `null` means no default (field must be present if `required: true`)

`Enum(...)` enumerates allowed values inline. The validator rejects any value not in the list.

**`tables[]` table**

Each row declares one table that may appear in documents of this kind:

- `ordered: true` means row sequence is semantically meaningful (the validator preserves it)
- `ordered: false` means rows can appear in any order
- `primary_key` names the column used as a stable row identifier; `null` means no primary key

**`columns[]` table**

Per-column constraints are scoped to their parent table via the `table` column. A column marked `required: true` must have a non-empty value in every row. Types follow the same vocabulary as `fields[]`.

**`relations[]` table**

Each row declares one allowed predicate for `rel:` triples in documents of this kind:

- `subject_type` and `object_type` constrain what can appear on each side of the triple
- `required: true` means at least one triple with this predicate must exist
- `Path` as `object_type` means the object is a filesystem path, not an SDIF identifier

**`rule_functions[]` table**

Lists the functions that may appear inside `rules:` s-expressions. `min_args` and `max_args` specify the allowed argument count. The validator rejects any rule that calls an undeclared function or passes the wrong number of arguments.

**Type vocabulary summary**

| Type | Meaning |
|------|---------|
| `Identifier` | Dot-separated alphanumeric identifier (e.g. `team.platform`) |
| `String` | Arbitrary text value, quoted if it contains spaces |
| `Path` | Filesystem path (relative or absolute) |
| `Enum(a,b,c)` | One of the listed literal values |

## Try it locally

```bash
sdif validate plan.sdif --schema schema.sdif
sdif validate plan.sdif --schema schema.sdif --json
```
