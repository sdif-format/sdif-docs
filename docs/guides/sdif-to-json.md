---
title: "SDIF to JSON"
sidebar_position: 4
---

# SDIF to JSON

The `sdif to-json` command converts an SDIF document to JSON, writing the result to stdout.

```bash
sdif to-json <path>
```

**Input:** A `.sdif` source file.

**Output:** JSON written to stdout.

To save the result:

```bash
sdif to-json plan.sdif > plan.json
```

---

## How SDIF maps to JSON

The output is a single JSON object. Each kind of SDIF content maps to a key in that object.

### Scalar fields

Each `key value` statement in the SDIF document becomes a top-level key in the JSON object:

```
@sdif 1.0

title "Q3 Plan"
status active
revision 2
```

Becomes:

```json
{
  "title": "Q3 Plan",
  "status": "active",
  "revision": "2"
}
```

All values are emitted as JSON strings. SDIF has no numeric or boolean literal types, so `2` in SDIF becomes the string `"2"` in JSON, not the number `2`.

### The `kind` field

If the document contains a `kind` declaration, it is emitted as a top-level `"kind"` string key:

```
kind ProjectPlan
```

Becomes:

```json
{
  "kind": "ProjectPlan"
}
```

### Tables

Each SDIF table block becomes a JSON array of objects under the same key. Column names become the keys of each object:

```
tasks[id,name,status]:
  T1	Research	done
  T2	Draft	open
```

Becomes:

```json
{
  "tasks": [
    {"id": "T1", "name": "Research", "status": "done"},
    {"id": "T2", "name": "Draft",    "status": "open"}
  ]
}
```

### Relations

A `rel:` block becomes a JSON array under a `"relations"` key. Each triple is emitted as a three-element array `[subject, predicate, object]`:

```
rel:
  T1 blocks T2
  T2 requires M1
```

Becomes:

```json
{
  "relations": [
    ["T1", "blocks", "T2"],
    ["T2", "requires", "M1"]
  ]
}
```

---

## Concrete example

**Input — `plan.sdif`:**

```
@sdif 1.0

kind ProjectPlan

title "Website Relaunch"
owner Alice

milestones[id,name,due]:
  M1	"Design complete"	2026-06-01
  M2	"Beta launch"	2026-07-15

rel:
  M1 precedes M2
```

**Command:**

```bash
sdif to-json plan.sdif
```

**Output:**

```json
{
  "kind": "ProjectPlan",
  "title": "Website Relaunch",
  "owner": "Alice",
  "milestones": [
    {"id": "M1", "name": "Design complete", "due": "2026-06-01"},
    {"id": "M2", "name": "Beta launch",     "due": "2026-07-15"}
  ],
  "relations": [
    ["M1", "precedes", "M2"]
  ]
}
```

---

## Known limitations

### Canonical form and hash are not preserved

The JSON output carries the document's logical content but not its canonical byte form. If you need a stable identifier, compute the hash before converting:

```bash
sdif hash plan.sdif
sdif to-json plan.sdif > plan.json
```

### Rules blocks are not represented

SDIF supports constraint rules in schema documents. Rules blocks have no JSON representation and are not included in the output.

### Schema and directive metadata

The `@sdif 1.0` header directive is not emitted as a JSON key. If the document contains additional directives, they may appear under a top-level `"_directives"` key, but this behavior is implementation-defined. Do not rely on it for programmatic use.

### All values are strings

SDIF values are untyped by default. `sdif to-json` emits all scalar values as JSON strings. If downstream consumers require typed values (e.g. a number or boolean), you will need to coerce them after conversion.

### AI projections

`.sdif.ai` projection files can be passed to `sdif to-json`. The converter first expands any grouped relations and alias mappings before emitting JSON, so the output reflects the full canonical content, not the compact projection form.

---

## Round-trip expectations

Converting SDIF to JSON and back with `sdif from-json` is not fully lossless. Expect the following:

| Content | Survives round-trip? |
|---|---|
| Scalar fields | Yes |
| Tables (uniform column structure) | Yes (column order may vary) |
| `kind` declaration | No — `from-json` does not emit `kind` |
| `rel:` blocks | No — relations become a flat array in JSON; `from-json` treats that array as a table, not a `rel:` block |
| Canonical hash | No — source formatting differs |
| All-string values | Yes |

If you need to move data between systems and preserve SDIF semantics, pass the `.sdif` file directly rather than routing through JSON.

---

## Next steps

- To convert JSON back to SDIF, see [JSON to SDIF](json-to-sdif.md).
- To produce a stable hash before conversion, see [Canonicalize a Document](canonicalize-a-document.md).
- To validate an SDIF document, see [Validate with Schema](validate-with-schema.md).
