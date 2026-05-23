---
title: "JSON to SDIF"
sidebar_position: 3
---

# JSON to SDIF

The `sdif from-json` command converts a JSON file to SDIF source, writing the result to stdout.

```bash
sdif from-json <path>
```

**Input:** A `.json` file.

**Output:** SDIF source written to stdout.

To save the result:

```bash
sdif from-json data.json > data.sdif
```

---

## How JSON maps to SDIF

### Top-level object keys become scalar fields

A top-level JSON object key with a scalar value becomes a `key value` statement:

```json
{
  "title": "Q3 Plan",
  "status": "active",
  "revision": "2"
}
```

Becomes:

```
@sdif 1.0

title Q3 Plan
status active
revision 2
```

String values that contain spaces are quoted in the output. Bare identifiers (letters, digits, hyphens, underscores) are written without quotes.

### Arrays of objects become tables

A top-level key whose value is a JSON array of objects becomes an SDIF table block. Column headers are inferred from the union of all keys found across objects in the array. Rows are written tab-delimited.

```json
{
  "tasks": [
    {"id": "T1", "name": "Research", "status": "done"},
    {"id": "T2", "name": "Draft",    "status": "open"}
  ]
}
```

Becomes:

```
@sdif 1.0

tasks[id,name,status]:
  T1	Research	done
  T2	Draft	open
```

Each row is indented with two spaces; columns are separated by a literal tab character (U+0009).

### The `kind` field is not inferred

`sdif from-json` does not add a `kind` declaration. If your workflow depends on a specific kind, add it manually after conversion:

```bash
sdif from-json data.json > data.sdif
# Then open data.sdif and add:
#   kind ProjectPlan
# as the first statement after the header.
```

---

## Concrete example

**Input — `project.json`:**

```json
{
  "title": "Website Relaunch",
  "owner": "Alice",
  "milestones": [
    {"id": "M1", "name": "Design complete", "due": "2026-06-01"},
    {"id": "M2", "name": "Beta launch",     "due": "2026-07-15"}
  ]
}
```

**Command:**

```bash
sdif from-json project.json
```

**Output:**

```
@sdif 1.0

title "Website Relaunch"
owner Alice

milestones[id,name,due]:
  M1	"Design complete"	2026-06-01
  M2	"Beta launch"	2026-07-15
```

---

## Lossy cases and known limitations

Not all JSON structures map cleanly to SDIF. Be aware of the following cases.

### Nested objects

SDIF has no native nested-object type. When a top-level key holds a nested JSON object, `sdif from-json` emits it as a quoted JSON string, preserving the raw data but losing structure:

```json
{"meta": {"author": "Alice", "version": 1}}
```

May become:

```
meta "{\"author\": \"Alice\", \"version\": 1}"
```

You will need to decide whether to flatten the nested keys manually (e.g. `meta_author Alice`) or define a table to hold the data.

### Arrays of mixed types

SDIF tables require uniform column structure. An array that mixes objects with different key sets, or that mixes objects with primitives, cannot be converted cleanly. The converter will use the union of all keys as column headers, filling missing values with empty strings for rows that lack a given key. Arrays that contain non-object elements (strings, numbers, booleans) alongside objects are not representable as tables; conversion behavior in that case is undefined and the output may be malformed.

### Arrays of primitives

A top-level key whose value is an array of primitives (not objects) has no direct SDIF representation. This case is currently not handled and may be omitted or emitted as a quoted string. Restructure the data as an array of single-key objects before converting:

```json
{"tags": ["alpha", "beta"]}
// Restructure to:
{"tags": [{"tag": "alpha"}, {"tag": "beta"}]}
```

### JSON null

Null values are written as empty strings in SDIF. There is no SDIF null literal. A cell or field that was `null` in JSON will appear as an empty value:

```json
{"assignee": null}
// Becomes:
// assignee ""
```

### Deep nesting

Structures nested more than one level deep are not recursively converted. Only the top level of the JSON object is walked; any nested arrays or objects at deeper levels are serialized as quoted strings.

---

## Round-trip expectations

The `sdif from-json` and `sdif to-json` commands are not fully symmetric. Expect the following:

| Content | Survives round-trip? |
|---|---|
| Scalar string fields | Yes |
| Tables (arrays of uniform objects) | Yes (column order may differ) |
| `kind` declaration | No — must be added manually |
| Nested objects | No — stored as escaped JSON strings |
| Arrays of primitives | No — not representable |
| Null values | Partial — becomes empty string |
| SDIF `rel:` blocks | No — relations are not produced by `from-json` |

If you convert SDIF to JSON with `sdif to-json` and then back with `sdif from-json`, the result will be structurally similar but will not be byte-identical to the original source, and the canonical hash will differ if the original had a `kind` declaration or `rel:` block.

---

## Next steps

- To validate the resulting SDIF against a schema, see [Validate with Schema](validate-with-schema.md).
- To produce the canonical form and compute a stable hash, see [Canonicalize a Document](canonicalize-a-document.md).
- To convert SDIF back to JSON, see [SDIF to JSON](sdif-to-json.md).
