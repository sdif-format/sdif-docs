---
title: "sdif (core)"
sidebar_position: 2
---

# sdif (core)

The `sdif` package is the reference Python implementation of SDIF. It provides everything needed to parse, validate, canonicalize, hash, convert, and project SDIF documents.

**GitHub:** [https://github.com/sdif-format/sdif](https://github.com/sdif-format/sdif)

**Install:** `pip install sdif`

## Components

### Parser

Reads `.sdif` source files and produces an abstract syntax tree. Handles all SDIF constructs: tables, relations, rules, schemas, and comments.

The parser applies configurable policy limits on document size, row count, and string length. Default limits are appropriate for most documents. Large documents may require a custom `Policy`.

### Canonicalizer

Produces a deterministic canonical byte representation of an SDIF document under the `canonical-syntax-v1` algorithm. Canonical output is stable across environments and implementations that follow the same specification.

Canonical bytes are written to `.sdif.canon` files.

### Hasher

Computes a SHA-256 hash over the canonical bytes of a document. The hash identifies document content independent of whitespace or field ordering in the source.

Use: `sdif hash <path>`

### Schema Validator

Validates SDIF documents against a `kind Schema` document. Reports field type mismatches, missing required fields, and unrecognized fields.

The schema file must be a valid SDIF document with `kind Schema`, not a canonical output file.

### JSON Conversion

Converts between SDIF and JSON in both directions.

- `sdif to-json <path>` — emits a JSON representation of the document
- `sdif from-json <path>` — reads JSON and produces SDIF source

Round-trip fidelity: `JSON → SDIF → JSON` preserves field values and structure for types that have direct JSON equivalents.

### AI Projection

Converts SDIF to a compact AI-facing representation (`.sdif.ai`) and back.

- `sdif ai <path>` — generates the AI projection; supports `--alias FIELD=ALIAS` for custom column abbreviations
- `sdif from-ai <path>` — reconstructs SDIF source from an AI projection

Round-trip fidelity: `SDIF → SDIF AI → SDIF` preserves the canonical hash. The reconstructed document canonicalizes to the same bytes as the original.

### CLI

Full command-line interface:

| Command | Description |
|---|---|
| `sdif parse <path>` | Parse and display the document AST |
| `sdif canon <path>` | Print canonical bytes |
| `sdif hash <path>` | Print the SHA-256 hash |
| `sdif tokens <path>` | Count tokens |
| `sdif to-json <path>` | Convert to JSON |
| `sdif from-json <path>` | Convert from JSON |
| `sdif ai <path>` | Generate AI projection |
| `sdif from-ai <path>` | Reconstruct from AI projection |
| `sdif validate <path> --schema <path>` | Validate against a schema |
| `sdif inspect <path>` | Inspect document structure |
| `sdif fmt <path>` | Format source; `--check` to verify without writing |

### Python API

All CLI operations are available as Python functions. Import from the `sdif` package:

```python
from sdif import parse_file, canonicalize, document_hash, to_json, from_json
```

Refer to the source repository for the full API reference.

## Conformance

The package ships with a conformance fixture suite. Fixtures cover valid and invalid documents for each grammar construct, canonicalization edge cases, and round-trip paths.
