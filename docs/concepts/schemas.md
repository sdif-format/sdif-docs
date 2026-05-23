---
title: "Schemas"
sidebar_position: 7
---

# Schemas

A schema is an SDIF document that describes the expected structure of another document kind. It lists which fields a document must or may have, what types those fields hold, what tables exist and how their columns are typed, which relation predicates are valid, and which rule functions the document's `rules:` block may use.

Schemas are optional in SDIF. A document without a referenced schema is still valid SDIF — it just cannot be validated beyond basic syntax. Schemas become important when data is shared across teams or tools, when correctness guarantees are needed, or when canonical hashing must be stable across insertion-order variation.

## A Schema is a Document

A schema is itself an SDIF document with `kind Schema`. It uses the same header, the same field syntax, and the same table syntax as any other document. This means schemas are readable by the standard parser, can be hashed and versioned like any other document, and can be validated against a meta-schema if needed.

```
@sdif 1.0
kind Schema
id example.plan.v1
for_kind Plan
```

The `for_kind` field names the document kind that this schema describes. A document references its schema via the `schema` field:

```
@sdif 1.0
kind Plan
id my.plan
schema example.plan.v1
```

When `sdif validate` is invoked with a schema, it matches the document's `schema` field value against the schema's `id` field to confirm they correspond.

## Declaring Fields

The `fields` table declares the scalar fields expected in the target document kind:

```
fields[name,type,required,default]:
  id	Identifier	true	
  title	String	true	
  status	Enum(open,closed,draft)	true	open
  owner	Identifier	false	
```

Each row names one field. The columns are:

- `name` — the field name as it appears in documents of this kind.
- `type` — the value type (see [Types](#types) below).
- `required` — whether the field must be present. Values are `true` or `false`.
- `default` — a default value used when the field is absent and `required` is `false`. Leave empty if there is no default.

## Declaring Tables

The `tables` table lists the tables that may appear in documents of this kind:

```
tables[name,ordered,primary_key]:
  milestones	false	id
  events	true	
```

- `name` — the table name as it appears in documents of this kind.
- `ordered` — whether row order is meaningful. `true` means preserve order; `false` means rows are sorted by primary key in canonical form.
- `primary_key` — the column name used as the primary key. Leave empty for ordered tables that have no natural key.

## Declaring Columns

The `columns` table describes the columns within each declared table:

```
columns[table,name,type,required]:
  milestones	id	Identifier	true
  milestones	status	Enum(done,pending,blocked)	true
  milestones	gate	String	true
  milestones	evidence	Path	false
```

- `table` — the table this column belongs to (must match a name declared in the `tables` table).
- `name` — the column name.
- `type` — the column value type.
- `required` — whether every row must have a non-empty value in this column.

## Declaring Relations

The `relations` table lists the relation predicates that are valid in documents of this kind:

```
relations[predicate,subject_type,object_type,required]:
  depends_on	Identifier	Identifier	false
  blocks	Identifier	Identifier	false
```

- `predicate` — the predicate name as it appears in `rel:` triples.
- `subject_type` and `object_type` — the expected types of the subject and object identifiers.
- `required` — whether at least one triple with this predicate must be present.

## Declaring Rule Functions

The `rule_functions` table lists the functions that are permitted in the document's `rules:` block:

```
rule_functions[name,min_args,max_args]:
  missing	1	1
  dangling	1	1
  invalid	1	1
  eq	2	2
  unknown	1	1
```

- `name` — the function identifier as it appears in `(deny ...)` or `(warn ...)` expressions.
- `min_args` and `max_args` — the minimum and maximum number of arguments the function accepts.

This table is less commonly authored by hand. Validators use it to confirm that rule expressions in documents use only known, schema-declared functions.

## Types

SDIF 1.0 supports the following field and column types:

| Type | Description |
|---|---|
| `Identifier` | A bare identifier: letters, digits, underscores, dots, no spaces |
| `String` | Any text value, quoted or unquoted |
| `Path` | A file path or URI-like reference |
| `Enum(val1,val2,...)` | A closed set of allowed values, listed in parentheses |

Types are used by the validator to check that field and column values conform to the declared type. For example, a field declared as `Enum(open,closed,draft)` may only hold one of those three values.

## A Complete Schema Example

The following is a complete schema for a simple `Plan` document kind:

```
@sdif 1.0
kind Schema
id example.plan.v1
for_kind Plan

fields[name,type,required,default]:
  id	Identifier	true	
  schema	Identifier	false	
  title	String	true	
  status	Enum(open,closed,draft)	true	draft
  owner	Identifier	false	

tables[name,ordered,primary_key]:
  milestones	false	id

columns[table,name,type,required]:
  milestones	id	Identifier	true
  milestones	status	Enum(done,pending,blocked)	true
  milestones	gate	String	true
  milestones	evidence	Path	false

relations[predicate,subject_type,object_type,required]:
  depends_on	Identifier	Identifier	false

rule_functions[name,min_args,max_args]:
  missing	1	1
  dangling	1	1
```

A `Plan` document referencing this schema would be validated as follows: its `id` and `title` fields must be present, its `status` must be one of `open`, `closed`, or `draft`, the `milestones` table must have `id`, `status`, and `gate` in every row, and any `rel:` triples may only use the `depends_on` predicate.

## What Happens Without a Schema

When no schema is present, SDIF documents are still parsed and processed normally. The parser accepts any field names, any table structures, and any relation predicates. Canonicalization treats all tables as ordered (since no `ordered` or `primary_key` declaration exists). Validation is skipped or limited to syntax-level checks only.

Schemas are not required for SDIF to be useful — they become valuable when a document kind is shared, automated, or subject to correctness requirements.
