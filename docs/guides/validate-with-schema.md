---
title: "Validate with a Schema"
sidebar_position: 6
---

# Validate with a Schema

Schema validation checks that a document's fields, table columns, and relations conform to the rules declared in a `kind Schema` document. The validator reports diagnostics with severity, rule name, and location so you can fix problems iteratively.

---

## 1. Write or obtain a Schema document

A Schema document has `kind Schema` and declares the fields, tables, columns, and relations that are valid for the target kind. The `for_kind` field names the kind being described.

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
	title	String	true	null
	status	Enum(open,closed,blocked)	true	open
	priority	Enum(P0,P1,P2,P3)	false	P2

tables[name,ordered,primary_key]:
	milestones	false	id

columns[table,name,type,required]:
	milestones	id	Identifier	true
	milestones	status	Enum(done,pending,blocked)	true
	milestones	evidence	Path	false

relations[predicate,subject_type,object_type,required]:
	depends_on	Identifier	Identifier	false
	validated_by	Identifier	Identifier	false
```

Save this as `schemas/plan.schema.sdif`.

---

## 2. Reference the schema in your document

The document being validated must declare its schema via the `schema` field. The value must match the `id` of the Schema document.

```
@sdif 1.0
kind Plan
id my.plan
schema example.plan.v1
status open
```

If the `schema` field is absent the validator cannot match the document to a schema and will report an error.

---

## 3. Run validation

```bash
sdif validate document.sdif --schema schemas/plan.schema.sdif
```

Pass `--json` to get structured output suitable for scripting:

```bash
sdif validate document.sdif --schema schemas/plan.schema.sdif --json
```

The command exits with code `0` when validation passes and non-zero when any error-severity diagnostic is reported.

---

## 4. Read diagnostics

Each diagnostic line reports:

- **Severity** — `error` (blocks clean exit) or `warning` (informational)
- **Rule** — the validation rule that fired, such as `missing`, `dangling`, or `invalid`
- **Message** — a human-readable description of the problem
- **Location** — field name, table name, or relation predicate where the problem was found

Example output for a document missing the required `title` field:

```
error  missing  required field 'title' is not present  field:title
```

---

## 5. A complete example: deliberate error

**Document** (`examples/plan.sdif`) — `title` is omitted:

```
@sdif 1.0
kind Plan
id release.v2.validation_plan
schema example.plan.v1
status open
priority P0
owner team.platform

milestones[id,status,evidence]:
	R1	done	reports/syntax.md
	R2	pending	reports/canonical.md

rel:
	R2 depends_on R1
```

**Schema** (`schemas/plan.schema.sdif`) — declares `title` as required:

```
@sdif 1.0
kind Schema
id example.plan.v1
schema sdif.schema.v1
for_kind Plan

fields[name,type,required,default]:
	kind	Identifier	true	null
	id	Identifier	true	null
	schema	Identifier	true	null
	title	String	true	null
	status	Enum(open,closed,blocked)	true	open
	priority	Enum(P0,P1,P2,P3)	false	P2
```

**Run:**

```bash
sdif validate examples/plan.sdif --schema schemas/plan.schema.sdif
```

**Output:**

```
error  missing  required field 'title' is not present  field:title
validation failed: 1 error, 0 warnings
```

**Fix:** add `title "Release v2 validation plan"` to the document and re-run. A clean document produces:

```
validation passed: 0 errors, 0 warnings
```

---

## 6. Common error classes

| Rule | What it means | How to fix |
|---|---|---|
| `missing` | A required field or column value is absent | Add the field or column value |
| `invalid` | A field value is not in the declared enum or type | Correct the value to match the declared type or enum |
| `dangling` | A relation references an identifier that does not exist in the document | Remove the relation or add the missing entity |

---

## 7. Declarative rules blocks

Beyond type-checking, a document can include a `rules:` block that adds constraints evaluated at validation time. Rules use the `(deny ...)` and `(warn ...)` forms with built-in functions:

| Function | Meaning |
|---|---|
| `missing(field)` | Fire if the named field is absent |
| `dangling(rel)` | Fire if any relation predicate references a missing entity |
| `invalid(field)` | Fire if the named field fails type or enum validation |
| `eq(field,value)` | Fire if the named field equals the given value |

Example rules block:

```
rules:
  (deny missing(evidence))
  (deny dangling(rel))
  (warn eq(authority,Unknown))
```

These rules are evaluated on top of schema type-checking. A document passes validation only when no `deny` rule fires and no schema error is reported.

---

## 8. Iterate until clean

The typical workflow:

1. Run `sdif validate` and read the diagnostic list.
2. Fix each `error`-severity diagnostic in the document.
3. Re-run until the output shows `0 errors`.
4. Address any remaining `warning`-severity diagnostics as appropriate.

For CI pipelines, check the exit code directly:

```bash
sdif validate document.sdif --schema schemas/plan.schema.sdif && echo "OK"
```
