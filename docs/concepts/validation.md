---
title: "Validation"
sidebar_position: 8
---

# Validation

Validation checks an SDIF document against its schema and its own `rules:` block. It answers the question: does this document conform to what it claims to be? A document that passes validation has all required fields present with correct types, all table rows correctly typed, all relation predicates recognized, and all rule expressions satisfied.

Validation is a separate step from parsing. Parsing checks that the document is syntactically valid SDIF. Validation checks that its content matches the contract described by the schema.

## Running the Validator

```bash
sdif validate --schema schema.sdif plan.sdif
```

The validator reads the document and the schema, then reports any violations as diagnostics. If there are no violations, it exits with a zero status code. If there are errors, it exits with a non-zero status code and prints diagnostics to standard output.

## What the Validator Checks

### Required Fields

Every field declared with `required=true` in the schema's `fields` table must be present in the document. A field that is absent when required produces an error.

### Field Types

Each field value is checked against the declared type. A field declared as `Identifier` must hold a bare identifier (no spaces, no special characters). A field declared as `Enum(open,closed,draft)` must hold exactly one of those values. A field declared as `String` accepts any text.

### Required Columns

Every column declared with `required=true` in the schema's `columns` table must have a non-empty value in every row of its table. A row with an empty required column produces an error.

### Column Types

Each column value in each row is checked against the declared column type, the same way as scalar field types.

### Relation Predicates

Every predicate in the document's `rel:` block is checked against the schema's `relations` table. An unrecognized predicate produces an error. If a predicate is declared as `required=true`, the validator checks that at least one triple with that predicate exists.

### Rule Expressions

The validator evaluates each expression in the document's `rules:` block. Expressions that use functions not declared in the schema's `rule_functions` table produce a warning. Expressions whose conditions are met trigger the severity declared in the expression (`deny` produces an error, `warn` produces a warning).

## The `rules:` Block

The `rules:` block contains validation expressions that authors embed directly in the document. These rules travel with the document and are evaluated whenever the document is validated:

```
rules:
  (deny missing(id))
  (deny missing(status))
  (warn missing(title))
  (deny invalid(status))
```

Each expression is an s-expression. The outer wrapper is either `deny` (produces an error) or `warn` (produces a warning). The inner expression names the condition to test.

## Rule Functions

SDIF 1.0 defines the following built-in rule functions:

### `missing(field)`

Evaluates to true when the named field is absent from the document. Use with `deny` to make a field unconditionally required in the document itself, independent of the schema:

```
(deny missing(id))
```

### `dangling(rel)`

Evaluates to true when a relation subject or object identifier does not correspond to any `id` in the document. A dangling reference is a relation that points to something that does not exist:

```
(deny dangling(depends_on))
```

### `invalid(field)`

Evaluates to true when a field is present but its value does not conform to the declared type. Useful for surfacing type errors as explicit rule violations:

```
(deny invalid(status))
```

### `eq(field, value)`

Evaluates to true when the named field's value equals the given literal. Can be used to enforce specific required values:

```
(deny eq(status,obsolete))
```

### `unknown(field)`

Evaluates to true when a field is present but not declared in the schema. Use with `warn` to flag undeclared fields without treating them as hard errors:

```
(warn unknown(owner))
```

## Validation Output

The validator reports each violation as a diagnostic line. A diagnostic includes:

- **Severity** — `error` or `warning`
- **Rule** — the name of the check that fired (e.g., `missing-field`, `invalid-type`, `rule-deny`)
- **Message** — a human-readable description of the violation
- **Location** — the field name, table name, or row identifier where the violation occurred

Example output for a document missing a required `id` field and with a `status` value not in the declared enum:

```
error  missing-field    Field 'id' is required but not present
error  invalid-type     Field 'status' value 'wip' is not a valid Enum(open,closed,draft) value
```

When the validator finds no violations, it produces no output and exits cleanly.

## An Example Error Scenario

Consider this schema declaring `status` as `Enum(open,closed,draft)` and `id` as required:

```
fields[name,type,required,default]:
  id	Identifier	true	
  status	Enum(open,closed,draft)	true	draft
  title	String	true	
```

And this document:

```
@sdif 1.0
kind Plan
schema example.plan.v1
title "My plan"
status wip
```

Running `sdif validate --schema example.plan.v1.sdif plan.sdif` produces:

```
error  missing-field    Field 'id' is required but not present
error  invalid-type     Field 'status' value 'wip' is not a valid Enum(open,closed,draft) value
```

Two violations: the `id` field is missing, and `wip` is not an allowed `status` value. Fixing the document to add `id` and change `status` to `draft` clears both errors.

## Relationship Between Schema Rules and Document Rules

A schema may declare `rule_functions` that documents of its kind may use. Documents embed rule expressions in their own `rules:` block. This split means the schema defines the vocabulary of validation, and each document decides which rules to apply to itself.

Both are evaluated during `sdif validate`. Schema-level checks (required fields, type constraints, valid predicates) always run when a schema is present. Document-level `rules:` expressions are evaluated in addition to those checks.
