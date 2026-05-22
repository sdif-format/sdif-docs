---
title: "Tables"
sidebar_position: 5
---

# Tables

Tables are the primary mechanism for structured, repeating data in SDIF. They are compact by design: the column header is declared once, rows follow with tab-separated values, and no object delimiters, brackets, or closing tags are needed.

## Declaration Syntax

```
name[col1,col2,col3]:
```

A table declaration consists of:

- The table name (a bare identifier, lowercase with optional underscores)
- A bracketed, comma-separated column list
- A colon terminating the header

Immediately following the header, each row is indented with two spaces and its values are separated by a literal **HORIZONTAL TAB** character (U+0009).

```
milestones[id,status,gate,evidence]:
  R1	done	validate-syntax	reports/syntax.md
  R2	done	validate-canonical	reports/canonical.md
  R3	pending	validate-schema	reports/schema.md
  R4	pending	validate-semantics	reports/semantics.md
```

## The Tab Separator

Column values are separated by a **literal tab character** — U+0009. This is not a display convention or a suggestion; it is a hard format requirement. Parsers must not treat sequences of spaces as column delimiters.

When reading SDIF files in editors, enabling visible whitespace or "Show invisibles" makes tab characters visible as arrows or `→` glyphs.

In source code and fixtures, embed actual tab bytes between values. Do not use `\t` escape sequences in raw SDIF text unless your toolchain explicitly handles them.

## Indentation

In canonical form, rows are indented with **exactly two spaces** before the first column value. Source documents may use any consistent indentation, but two spaces is the canonical contract.

## Quoted Values

Column values containing spaces, tabs, or special characters must be double-quoted:

```
tasks[id,label,assignee]:
  T1	"Deploy to staging"	alice
  T2	"Run smoke tests"	bob
```

Unquoted values may not contain whitespace. Parsers treat the first unescaped tab as the column boundary.

## Empty Cells

An empty cell is represented by two adjacent tab characters (or a tab at the start of a row for the first column, or a trailing tab before end-of-line for the last column):

```
items[id,value,note]:
  A1	42	
  A2		"no value"
  A3	99	verified
```

In the example above, `A1` has an empty `note`, and `A2` has an empty `value`.

## Mixed Types in Columns

SDIF columns are typed by schema. In source documents without a schema, column values are untyped strings. A schema may declare a column as `String`, `Integer`, `Identifier`, `Enum(...)`, or other supported types. The parser validates values against the declared type during schema-aware parsing.

When no schema is present, all values are treated as strings.

## Primary Keys

A schema may declare a primary key for a table:

```
tables[name,ordered,primary_key]:
  milestones	false	id
```

The `primary_key` column names the column (or columns) that uniquely identify each row. Primary keys are used during canonicalization to sort rows in unordered tables, and by validators to detect duplicate entries.

## Ordered vs Unordered Tables

Tables have two modes, declared in the schema:

| Mode | `ordered` | Row handling |
|---|---|---|
| Unordered | `false` | Rows sorted by primary key in canonical form |
| Ordered | `true` | Row order preserved exactly as written |

**Unordered tables** are the common case. When `ordered=false`, canonicalization sorts rows by their primary key. This makes the canonical form independent of insertion order.

**Ordered tables** preserve the sequence of rows as authored. Use ordered tables when row position carries meaning — for example, a ranked list, a time-ordered event log, or an explicit sequence of steps.

When no schema is available, parsers preserve row order (treat as ordered).

## Schema Column Definition

Columns are declared in the schema under the `columns` table, referencing the parent table by name:

```
columns[table,name,type,required]:
  milestones	id	Identifier	true
  milestones	status	Enum(done,pending,blocked)	true
  milestones	gate	String	true
  milestones	evidence	String	false
```

Each row names the table it belongs to, the column name, the value type, and whether the column is required. Required columns must have a non-empty value in every row.

## Full Example

The following is the `milestones` table from a `Plan` document:

```
milestones[id,status,gate,evidence]:
  R1	done	validate-syntax	reports/syntax.md
  R2	done	validate-canonical	reports/canonical.md
  R3	pending	validate-schema	reports/schema.md
  R4	pending	validate-semantics	reports/semantics.md
```

With the schema declaring `milestones` as `ordered=false` and `primary_key=id`, the canonical form sorts these rows lexicographically by `id` — which in this case is already in order.

## Common Mistakes

- **Using spaces instead of tabs between columns.** A sequence of spaces between values is not a column separator. Only U+0009 counts.
- **Forgetting the colon** after the column header. `milestones[id,status]` without the trailing `:` is not a valid table declaration.
- **Quoting identifiers unnecessarily.** If a value contains no spaces or special characters, it should be unquoted. Over-quoting is not a parse error, but it reduces readability.
