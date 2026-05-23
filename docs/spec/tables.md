---
title: "Tables"
sidebar_position: 5
---

# Tables

A **table** is a named block of rows organized into typed, named columns. Tables are the primary structure for representing collections of records in SDIF. This page defines table syntax, column rules, row structure, the `null` literal in cells, multi-table documents, and canonical ordering.

For the column separator character rules (HTAB), see [Lexical Structure — Column Separator](./lexical-structure.md#column-separator-htab).

## Table Block Syntax

A table block consists of a **header line** followed by zero or more **row lines**.

### Header Line

The header line declares the table name and its column names:

```
name[col1,col2,...]:
```

- `name` MUST be a valid identifier as defined in [Lexical Structure — Identifiers](./lexical-structure.md#identifiers).
- Column names MUST each be valid identifiers and MUST be separated by commas (`,`) with no surrounding spaces inside the brackets.
- The header line MUST end with a colon (`:`).
- A table MUST declare at least one column.
- Column names MUST be unique within a single table.

Example header:

```
tasks[id,title,status,assignee]:
```

### Row Lines

Each row follows the header and MUST be indented with exactly two spaces (U+0020 U+0020).

- Column values within a row MUST be separated by a single **horizontal tab character** (HTAB, U+0009). Spaces MUST NOT be used as column separators.
- Parsers MUST NOT treat a run of spaces as equivalent to a tab in row context.
- Each row MUST provide values for columns in the same left-to-right order declared in the header.
- Missing trailing column values MAY be omitted from the right side of a row. The parser MUST treat omitted trailing columns as `null`.
- A row MUST NOT provide more column values than the header declares.

Example table (HTAB shown as `→` for readability; the actual file uses U+0009):

```
tasks[id,title,status,assignee]:
  task-42→Refactor auth module→in-progress→alice
  task-43→Write release notes→done→bob
  task-44→Update dependencies→null→null
```

## The `null` Literal in Cells

The token `null` in a table cell represents an absent value for that column in that row.

- `null` is case-sensitive. The string `"null"` is a distinct quoted value.
- A `null` cell value MUST be treated by processors as carrying no value, equivalent to the column being unset for that row.
- Schema validators MAY enforce that specific columns are non-null; the parser itself MUST NOT reject a `null` cell value.

## Multiple Tables in One Document

A document MAY contain any number of table blocks. Each table is identified by its name.

- Table names MUST be unique within a single document at the parse level. Parsers SHOULD report an error if the same table name appears more than once.
- Tables with different names are independent; column names MAY be reused across different tables without conflict.
- In source form, table blocks MAY appear in any order relative to scalar fields and other block types. In canonical form, table blocks MUST appear in lexicographic order by table name (see [Document Model — Block Ordering](./document-model.md#block-ordering)).

Example document with two tables:

```
@sdif 1.0
kind Sprint

id     sprint-3
title  "Q2 Sprint 3"

tasks[id,title,status]:
  task-42→Refactor auth module→in-progress
  task-43→Write release notes→done

members[username,role]:
  alice→lead
  bob→contributor
```

## Canonical Row Ordering

Row ordering in canonical form depends on whether a schema is present.

- If a schema for the table declares a **primary key**, then in canonical form, rows MUST be sorted in ascending lexicographic order by the primary key column value(s).
- If no schema is present or the schema does not declare a primary key, row order MUST be preserved as it appears in the source document.
- Canonicalizers MUST NOT reorder rows for tables without a declared primary key.

## Tables vs. Relation Blocks

Tables and `rel:` blocks are distinct constructs and MUST NOT be confused.

| Feature | Tables | Relation blocks |
|---|---|---|
| Structure | Named columns, typed rows | Subject–predicate–object triples |
| Syntax | `name[cols...]:` + HTAB-delimited rows | `rel:` + indented triple lines |
| Purpose | Structured records | Semantic graph assertions |
| Multiple per document | Yes, by name | Yes, merged into one canonical set |

A table row expresses a record in a named schema. A triple in a `rel:` block expresses a relationship between named entities. The two forms are complementary and MAY coexist in the same document.

See [Document Model — Relation Blocks](./document-model.md#relation-blocks) for the `rel:` syntax.
