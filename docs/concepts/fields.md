---
title: "Fields"
sidebar_position: 4
---

# Fields

Scalar fields are the simplest data structure in an SDIF document. A field is a single line with a name and a value, separated by whitespace. Fields hold one piece of information each — they do not nest, repeat, or contain sub-structure. For repeating structured data, use a [table](./tables.md) instead.

## Basic Syntax

A field looks like this:

```
fieldname value
```

The field name is a bare identifier: lowercase letters, digits, and underscores, beginning with a letter. The value follows after one or more spaces. Everything on the line after the name and its separating whitespace is the value.

## Unquoted Values

When a value contains no whitespace or special characters, it can be written without quotes:

```
status open
kind Plan
id release.v2.validation_plan
priority high
```

Unquoted values are read literally. They are sometimes called "bare" values. They work well for identifiers, short tokens, and enumeration members where the value set is known.

## Quoted String Values

When a value contains spaces, or when you want to be explicit that it is a string, wrap it in double quotes:

```
title "Release v2 validation plan"
description "Covers all validation gates before the public release."
assignee "Alice B."
```

Quoted strings begin and end with `"`. The content between the quotes is the value. Quotes are the right choice whenever the value reads as natural language, contains punctuation, or could be misread as a keyword.

## Multiline Values

Triple-quoted strings span multiple lines. The delimiter is `"""`:

```
notes """
This plan was drafted after the Q2 retrospective.
It covers gates R1 through R4.
See the milestones table for current status.
"""
```

The content between the opening `"""` and the closing `"""` is the value, including all internal newlines and indentation. Triple-quoted strings are useful for prose descriptions, embedded snippets, and any value that naturally spans more than one line.

## When to Quote

The rule of thumb is:

- Use **unquoted** values for identifiers, status tokens, enumeration members, and short values with no spaces.
- Use **quoted strings** for titles, descriptions, labels, and any value containing spaces or punctuation.
- Use **triple-quoted strings** for values that span multiple lines.

Over-quoting is not a parse error, but unquoted values are more readable for tokens and identifiers. Under-quoting (omitting quotes around a value with spaces) will cause a parse error, since the parser reads everything up to the first whitespace as the value and then encounters unexpected trailing content.

## Common Field Names by Convention

SDIF does not mandate specific field names, but certain names appear repeatedly across document types and carry conventional meanings:

| Field name | Conventional meaning |
|---|---|
| `id` | Unique identifier for this document within its namespace |
| `kind` | Document type — declared as a directive, not a plain field |
| `schema` | Reference to the schema document that validates this document |
| `status` | Current state (e.g., `open`, `closed`, `draft`, `approved`) |
| `title` | Human-readable name for the document |

The `id` field is by far the most universal. Nearly every SDIF document has one. Canonicalization places `id` first among scalar fields, and validators often declare it required.

## How Fields Differ from Table Columns

Fields and table columns both hold data, but they serve different roles:

- A **field** holds a single value. There is at most one `title` field per document.
- A **table column** holds one value per row. A table with ten rows has ten values in each column.

Fields are appropriate when the information is singular — the document's own title, its status, its unique id. Tables are appropriate when the same shape of data repeats — a list of milestones, a set of dependencies, a collection of tagged items.

## Complete Example

The following document uses a variety of field forms alongside a table:

```
@sdif 1.0
@profile source

kind Plan
id q3.engineering.plan
schema example.plan.v1
title "Q3 Engineering Plan"
status draft
owner alice

notes """
This plan covers the three main workstreams for Q3.
Priorities were set in the June planning session.
"""

milestones[id,status,owner]:
  M1	done	alice
  M2	in-progress	bob
  M3	pending	carol
```

Reading the scalar fields: `id` is an unquoted identifier, `title` is a quoted string, `status` and `owner` are short unquoted tokens, and `notes` is a triple-quoted multiline string. The `milestones` table that follows holds the repeating structured data, while the fields above describe the document as a whole.
