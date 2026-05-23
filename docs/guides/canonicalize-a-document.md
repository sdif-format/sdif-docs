---
title: "Canonicalize a Document"
sidebar_position: 5
---

# Canonicalize a Document

SDIF separates source form from canonical form. Source files can contain comments, blank lines, varied whitespace, and any row ordering the author chose. The canonical form is a deterministic byte sequence that represents the same logical content: same fields, same tables, same relations — but normalized. Two documents with identical logical content always produce identical canonical bytes, and therefore an identical hash.

This guide walks through the steps to produce canonical SDIF and compute a stable hash for a document.

---

## Step 1: Start with a source file

For this guide, assume a source file `plan.sdif`:

```
@sdif 1.0

# Q3 project plan
kind ProjectPlan

title "Website Relaunch"
owner Alice

tasks[id,name,status]:
  T2	Draft	open
  T1	Research	done

rel:
  T1 blocks T2
```

This file has a comment, and the table rows happen to be in reverse order. The canonical form will normalize both.

---

## Step 2: Print the canonical form

Run `sdif canon` to print the canonical byte sequence to stdout:

```bash
sdif canon plan.sdif
```

**Output:**

```
@sdif 1.0
kind ProjectPlan
owner Alice
title "Website Relaunch"
tasks[id,name,status]:
  T1	Research	done
  T2	Draft	open
rel:
  T1 blocks T2
```

Compared to the source, the canonical form:

- Removes comments (`# Q3 project plan`)
- Removes blank lines between sections
- Sorts scalar fields alphabetically by key (`owner` before `title`)
- Sorts table rows (here, `T1` before `T2` because rows are sorted lexicographically by their first column)
- Sorts relations lexicographically by subject, then predicate, then object
- Normalizes the `@sdif 1.0` header to the first line with no leading whitespace

The semantic content is identical. No fields, rows, or relations are added or removed.

---

## Step 3: Use schema-aware canonicalization

Without a schema, `sdif canon` sorts table rows by their raw text values. With a schema, it can sort by a designated primary key, handle `Enum` types correctly, and apply field ordering defined in the schema.

```bash
sdif canon plan.sdif --schema schemas/plan.schema.sdif
```

Use schema-aware canonicalization when:

- You want row ordering to be stable across schema-defined primary keys rather than raw lexicographic order.
- Your schema declares `ordered=false` on a table (meaning rows have no meaningful sequence and should be sorted for canonical stability).
- You need hashes that are stable even if column order changes in future schema versions.

If your table has an `ordered=true` annotation in the schema, row order from the source is preserved in the canonical form.

---

## Step 4: Write the canonical form to a file

Use the `-o` flag to write directly to a file instead of stdout:

```bash
sdif canon plan.sdif -o plan.sdif.canon
```

The `.sdif.canon` extension is a convention, not a requirement. The file contains valid SDIF and can be inspected, validated, or passed to other `sdif` commands.

---

## Step 5: Compute the canonical hash

The hash is the SHA-256 of the canonical bytes. Use it to verify document identity across systems.

```bash
sdif hash plan.sdif
```

**Output:**

```
sha256:a3f1c2d8e9b04f5a...
```

With a schema:

```bash
sdif hash plan.sdif --schema schemas/plan.schema.sdif
```

The hash with and without a schema may differ if the schema changes row ordering. Use the same schema consistently when comparing hashes across environments.

To check that two source files represent the same document:

```bash
sdif hash file-a.sdif
sdif hash file-b.sdif
# Compare the two sha256 lines
```

---

## What changes vs. what stays the same

| Element | In source | In canonical form |
|---|---|---|
| Comments | Present | Removed |
| Blank lines | Present | Removed |
| Scalar field order | Author-defined | Alphabetical by key |
| Table row order | Author-defined | Sorted (lexicographic or by primary key with schema) |
| Relation order | Author-defined | Sorted lexicographically by subject, predicate, object |
| Quoted strings | Quoted or bare depending on content | Quoted if value contains spaces or special characters |
| Header (`@sdif 1.0`) | First non-blank, non-comment line | First line |
| `kind` declaration | Any position after header | Immediately after header |
| All fields and values | Present | Present, unchanged |
| All table data | Present | Present, unchanged |
| All relations | Present | Present, unchanged |

---

## Common errors

### Missing primary key when schema requires it

If your schema declares a primary key for a table and a row is missing that column's value, `sdif canon --schema` will report an error:

```
Error: table 'tasks' row missing primary key value for column 'id'
```

Ensure every row in the table has a non-empty value in the primary key column before running schema-aware canonicalization.

### Malformed table rows

Table rows must use literal tab characters (U+0009) as column separators. If a row uses spaces instead of tabs, the parser will treat the entire row content as a single column value rather than multiple columns. This will cause a column count mismatch:

```
Error: table 'tasks' row has 1 column(s), expected 3
```

To diagnose, use `sdif inspect`:

```bash
sdif inspect plan.sdif
```

This prints the parsed AST and makes tab vs. space issues visible.

### Hash differs from expected

If a hash does not match what you expect, check:

1. Whether you used the same schema (or lack of schema) in both cases.
2. Whether the source file has been modified since the reference hash was computed.
3. Whether the file encoding is consistent (UTF-8 is required).

You can compare the canonical output directly to identify the difference:

```bash
sdif canon file-a.sdif > a.canon
sdif canon file-b.sdif > b.canon
diff a.canon b.canon
```

---

## Next steps

- To validate a document against a schema before canonicalizing, see [Validate with Schema](validate-with-schema.md).
- To convert to JSON, see [SDIF to JSON](sdif-to-json.md).
- For the full command reference, see [CLI Reference](cli.md).
