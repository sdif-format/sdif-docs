---
title: "CLI Reference"
sidebar_position: 2
---

# CLI Reference

All commands follow the pattern:

```
sdif <command> <path> [flags]
```

Input is always a file path. Output goes to stdout unless the command modifies the file in place (`fmt` without `--check`).

---

## parse

**Purpose:** Parse a document and report directive and statement counts. Useful for quickly verifying that a file is well-formed.

**Usage:**
```bash
sdif parse <path>
```

**Input:** Any `.sdif` source file.

**Output:** A single line with directive and statement counts.

**Example:**
```bash
sdif parse examples/plan.sdif
# directives=2 statements=6
```

---

## canon

**Purpose:** Emit the canonical byte representation of a document to stdout. The canonical form is deterministic: the same logical document always produces the same bytes.

**Usage:**
```bash
sdif canon <path> [--schema <schema-path>]
```

**Input:** A `.sdif` source file. Optionally, a schema file for normalization guidance.

**Output:** Canonical SDIF bytes written to stdout.

**Example:**
```bash
sdif canon examples/plan.sdif
sdif canon examples/plan.sdif > examples/plan.sdif.canon
sdif canon examples/plan.sdif --schema schemas/plan.schema.sdif
```

---

## hash

**Purpose:** Compute the SHA-256 of the canonical bytes. Two documents with the same logical content produce the same hash regardless of source formatting.

**Usage:**
```bash
sdif hash <path> [--schema <schema-path>]
```

**Input:** A `.sdif` source file. Optionally, a schema file.

**Output:** A single line in the form `sha256:<hex>`.

**Example:**
```bash
sdif hash examples/plan.sdif
# sha256:a3f1c2d8...

sdif hash examples/plan.sdif --schema schemas/plan.schema.sdif
```

---

## tokens

**Purpose:** Analyze the token and byte footprint of a document. Reports raw byte size and estimated token counts. Useful for comparing SDIF compactness against other representations.

**Usage:**
```bash
sdif tokens <path>
```

**Input:** A `.sdif` source file.

**Output:** Token and byte analysis to stdout.

**Example:**
```bash
sdif tokens examples/plan.sdif
```

---

## to-json

**Purpose:** Convert an SDIF document to JSON. Tables become arrays of objects, relations become structured objects, and directive metadata is preserved.

**Usage:**
```bash
sdif to-json <path>
```

**Input:** A `.sdif` source file.

**Output:** JSON written to stdout.

**Example:**
```bash
sdif to-json examples/plan.sdif
sdif to-json examples/plan.sdif > examples/plan.json
```

---

## from-json

**Purpose:** Convert a JSON file to SDIF. Arrays of objects become table blocks; scalar fields become key-value statements.

**Usage:**
```bash
sdif from-json <path>
```

**Input:** A `.json` file.

**Output:** SDIF source written to stdout.

**Example:**
```bash
sdif from-json examples/plan.json
sdif from-json examples/plan.json > examples/plan.sdif
```

---

## ai

**Purpose:** Produce an AI projection (`.sdif.ai`) of a document. The projection is a compact, alias-friendly derived view optimized for model context windows. Field names can be shortened with `--alias`.

**Usage:**
```bash
sdif ai <path> [--alias FIELD=ALIAS ...]
```

**Input:** A `.sdif` source file.

**Output:** A `.sdif.ai` file written alongside the source, or to stdout.

**Flags:**

| Flag | Description |
|---|---|
| `--alias FIELD=ALIAS` | Replace a field name with a shorter alias in the projection. Repeatable. |

**Example:**
```bash
sdif ai examples/plan.sdif
sdif ai examples/plan.sdif --alias status=s --alias name=n
```

The resulting `.sdif.ai` file records the source hash and declared aliases so it can be reversed.

---

## from-ai

**Purpose:** Convert a `.sdif.ai` AI projection back to canonical SDIF. Aliases are expanded, grouped relations are unfolded, and the result is equivalent to canonicalizing the original source.

**Usage:**
```bash
sdif from-ai <path>
```

**Input:** A `.sdif.ai` projection file.

**Output:** Canonical SDIF written to stdout.

**Example:**
```bash
sdif from-ai examples/plan.sdif.ai
```

The reversal is lossless when no lossy aliases were applied. The resulting canonical SDIF will hash identically to the original source.

---

## validate

**Purpose:** Validate a document against a schema. Reports whether the document conforms and lists any violations.

**Usage:**
```bash
sdif validate <path> --schema <schema-path> [--json]
```

**Input:** A `.sdif` source file and a schema file.

**Output:** Validation result to stdout. With `--json`, emits structured JSON output suitable for programmatic consumption.

**Flags:**

| Flag | Description |
|---|---|
| `--schema <path>` | Required. Path to the schema document (`kind Schema`). |
| `--json` | Emit results as JSON instead of plain text. |

**Example:**
```bash
sdif validate examples/plan.sdif --schema schemas/plan.schema.sdif
sdif validate examples/plan.sdif --schema schemas/plan.schema.sdif --json
```

Exit code is `0` on success and non-zero if validation fails.

---

## inspect

**Purpose:** Inspect the AST (abstract syntax tree) of a document. Useful for debugging parser behavior and understanding how SDIF tokenizes a file.

**Usage:**
```bash
sdif inspect <path> [--json] [--schema <schema-path>]
```

**Input:** A `.sdif` source file.

**Output:** AST representation to stdout. With `--json`, emits the AST as JSON.

**Flags:**

| Flag | Description |
|---|---|
| `--json` | Emit AST as JSON. |
| `--schema <path>` | Optionally annotate the AST with schema type information. |

**Example:**
```bash
sdif inspect examples/plan.sdif
sdif inspect examples/plan.sdif --json
sdif inspect examples/plan.sdif --json --schema schemas/plan.schema.sdif
```

---

## fmt

**Purpose:** Format an SDIF document in place, normalizing whitespace and ordering to the canonical style. With `--check`, reports whether the file is already formatted without modifying it.

**Usage:**
```bash
sdif fmt <path> [--check] [--schema <schema-path>]
```

**Input:** A `.sdif` source file.

**Output:** Modifies the file in place (without `--check`). With `--check`, exits non-zero if the file is not formatted.

**Flags:**

| Flag | Description |
|---|---|
| `--check` | Check only; do not modify the file. Exits non-zero if formatting would change anything. |
| `--schema <path>` | Use schema type information to guide formatting decisions. |

**Example:**
```bash
# Format in place
sdif fmt examples/plan.sdif

# Check without modifying (useful in CI)
sdif fmt examples/plan.sdif --check

# Format with schema guidance
sdif fmt examples/plan.sdif --schema schemas/plan.schema.sdif
```
