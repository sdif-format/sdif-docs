---
title: "Schemas"
sidebar_position: 8
---

# Schemas

This page defines the normative structure and validation behavior of SDIF Schema documents.

A Schema document is an SDIF document that describes the allowed fields, tables, columns, relations, and rule functions for a specific document kind. Validators use Schema documents to check whether a target document conforms to its declared structure.

## Schema Document Identity

A Schema document MUST declare:

```
kind Schema
for_kind TypeName
```

- `kind` MUST be the literal identifier `Schema`.
- `for_kind` MUST be an identifier naming the document kind that this schema validates. For example, `for_kind Plan` declares a schema for documents whose `kind` field is `Plan`.

A Schema document MAY declare an `id`, `name`, and other standard metadata fields. These fields follow the same rules as in any SDIF document.

## Referencing a Schema

A document references a schema by including a `schema` scalar field:

```
schema my-schema-identifier
```

The value MUST be an identifier that resolves to a Schema document. The mechanism for resolution (filesystem path, registry lookup, or other means) is implementation-defined, but implementations MUST document their resolution strategy.

When a `schema` field is present, a conforming validator MUST load the named schema and apply all applicable validation rules defined in that schema to the target document. Validation MUST be performed after parsing and before any further processing.

## Field Declarations — `fields[name, type, required, default]:`

The `fields` table declares the scalar fields that a document of the target kind MAY or MUST contain. Each row in the table declares one field.

| Column | Type | Description |
|---|---|---|
| `name` | Identifier | The field key as it appears in a document |
| `type` | See [Type Vocabulary](#type-vocabulary) | The expected value type |
| `required` | `true` or `false` | Whether the field MUST be present |
| `default` | String or `null` | The value to assume when the field is absent and `required` is `false` |

Validation rules for scalar fields:

- A field listed with `required: true` MUST be present in the validated document. Its absence MUST be reported as a validation error.
- A field listed with `required: false` and a non-`null` default MAY be absent; the validator MUST treat the field as if it had the default value when it is missing.
- A field listed with `required: false` and a `null` default MAY be absent with no substitution applied.
- A field's value MUST conform to the declared `type`. A type mismatch MUST be reported as a validation error.
- Fields present in the document that are not listed in the `fields` table SHOULD be reported as a validation warning. Implementations MAY treat unexpected fields as errors if the schema declares `strict` mode (when such a mode is defined in a future version).

Example:

```
fields[name, type, required, default]:
  id        Identifier  true   null
  title     String      true   null
  status    Enum(draft,active,archived)  true   null
  priority  Enum(low,medium,high)        false  medium
```

## Table Declarations — `tables[name, ordered, primary_key]:`

The `tables` table declares the named tables that a document of the target kind MAY contain. Each row declares one table.

| Column | Type | Description |
|---|---|---|
| `name` | Identifier | The table name as it appears in a document |
| `ordered` | `true` or `false` | Whether row order is semantically significant |
| `primary_key` | Identifier or `null` | The column whose values uniquely identify rows; `null` if no primary key |

Validation rules for tables:

- If a table appears in a validated document but is not listed in the `tables` table, the validator SHOULD report a validation warning.
- If `ordered: false` and `primary_key` is `null`, the canonicalizer MUST report a canonicalization error for that table, as defined in [Canonicalization Rule 11](./canonicalization.md#rule-11--sort-schema-unordered-table-rows-by-primary-key).
- If `primary_key` is defined, the validator SHOULD check that no two rows share the same primary key value and SHOULD report a validation error on a duplicate.

## Column Declarations — `columns[table, name, type, required]:`

The `columns` table declares per-column constraints for tables named in the `tables` table.

| Column | Type | Description |
|---|---|---|
| `table` | Identifier | The table this column belongs to |
| `name` | Identifier | The column name |
| `type` | See [Type Vocabulary](#type-vocabulary) | The expected value type for this column |
| `required` | `true` or `false` | Whether this column MUST be present in every row |

Validation rules for columns:

- A column declared with `required: true` MUST have a non-empty value in every row of the named table. An empty or absent value MUST be reported as a validation error.
- A column value MUST conform to the declared `type`. A type mismatch MUST be reported as a validation error.
- Column declarations MUST reference a table that exists in the `tables` table. A `columns` row that references an undeclared table MUST be reported as a schema error.

## Relation Declarations — `relations[predicate, subject_type, object_type, required]:`

The `relations` table declares the allowed relation predicates for documents of the target kind.

| Column | Type | Description |
|---|---|---|
| `predicate` | Identifier | The relation predicate name |
| `subject_type` | Identifier or `null` | Expected type of the subject token; `null` means unconstrained |
| `object_type` | Identifier or `null` | Expected type of the object token; `null` means unconstrained |
| `required` | `true` or `false` | Whether at least one triple with this predicate MUST appear |

Validation rules for relations:

- A triple whose predicate is not listed in the `relations` table MUST be reported as a validation error.
- A triple whose subject does not match the declared `subject_type` MUST be reported as a validation error (when `subject_type` is not `null`).
- A triple whose object does not match the declared `object_type` MUST be reported as a validation error (when `object_type` is not `null`).
- A predicate declared with `required: true` MUST have at least one triple present. Its absence MUST be reported as a validation error.

## Rule Function Declarations — `rule_functions[name, min_args, max_args]:`

The `rule_functions` table declares the function names that are valid within `rules:` s-expressions for documents of the target kind.

| Column | Type | Description |
|---|---|---|
| `name` | Identifier | The function name as it appears inside a `rules:` expression |
| `min_args` | Integer string | Minimum number of arguments the function accepts |
| `max_args` | Integer string or `null` | Maximum number of arguments; `null` means unbounded |

Validation rules for rule functions:

- A function name used in a `rules:` block that is not listed in the `rule_functions` table MUST be reported as a validation error.
- A function invocation with fewer arguments than `min_args` MUST be reported as a validation error.
- A function invocation with more arguments than `max_args` (when `max_args` is not `null`) MUST be reported as a validation error.

## Type Vocabulary

The following types are defined for use in `type` columns of `fields`, `columns`, and `relations` tables:

| Type | Description |
|---|---|
| `Identifier` | A dot-separated alphanumeric token conforming to the identifier grammar in [Lexical Structure](./lexical-structure.md#identifiers) |
| `String` | Arbitrary UTF-8 text, optionally enclosed in double quotes |
| `Path` | A filesystem path value. Treated as an opaque string by the validator; see [Security](./security.md#no-external-references) for handling guidance |
| `Enum(v1,v2,...)` | A closed set of string literals. The value MUST be one of the listed alternatives. Alternatives are separated by commas with no surrounding whitespace inside the parentheses |

Types not listed in this table are not defined in SDIF 1.0. Implementations MUST report a schema error when an unrecognized type appears in a schema document. Additional types MAY be defined in future specification versions.

## Schema Validation Summary

A conforming validator applying a Schema document MUST perform, in order:

1. Check that `kind` in the target document matches `for_kind` in the schema.
2. Validate all scalar fields against the `fields` table (presence, type, enum membership).
3. Validate all table rows against the `tables` and `columns` tables (presence, type, required columns, primary key uniqueness).
4. Validate all relation triples against the `relations` table (allowed predicates, subject/object types, required predicates).
5. Validate all rule function invocations against the `rule_functions` table (name existence, argument counts).

Validation MUST be non-destructive. A validator MUST NOT modify the document being validated.
