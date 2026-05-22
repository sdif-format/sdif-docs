---
title: "Getting Started"
sidebar_position: 2
---

# Getting Started

This guide walks you through installing SDIF, writing your first document, and using the core CLI commands.

## Install

SDIF is distributed as a Python package. Python 3.9 or later is required.

```bash
pip install sdif
```

## Verify

Confirm the CLI is available:

```bash
sdif --help
```

You should see a list of available subcommands. If the command is not found, ensure your Python environment's `bin` directory is on your `PATH`.

## Your first SDIF document

Create a file called `examples/plan.sdif`:

```sdif
@sdif kind=Plan version=1.0
title: "Q3 Delivery Plan"
owner: "eng-team"

table milestones
  id	name	due	status
  m1	"Parser v1"	2024-07-01	done
  m2	"Canonical form"	2024-08-01	done
  m3	"Schema validation"	2024-09-01	in-progress

rel: m3 blocks m2
```

Note: column values in the `table` block are separated by literal tab characters (`\t`).

## Parse it

```bash
sdif parse examples/plan.sdif
```

Expected output:

```
directives=2 statements=6
```

The parser reports two directives (`@sdif` and `table milestones`) and six statements (the three key-value fields, one header row, two data rows, and the relation triple).

## Canonicalize

Produce the canonical byte representation of the document:

```bash
sdif canon examples/plan.sdif
```

The canonical form is emitted to stdout. It is whitespace-normalized and deterministic — the same logical document always produces the same bytes, regardless of how the source was formatted.

To save it:

```bash
sdif canon examples/plan.sdif > examples/plan.sdif.canon
```

## Hash

Compute the SHA-256 of the canonical bytes:

```bash
sdif hash examples/plan.sdif
```

Example output:

```
sha256:a3f1c2...
```

This hash is stable: any two documents with identical canonical forms will produce identical hashes, regardless of source formatting, whitespace, or comments.

## Convert to JSON

```bash
sdif to-json examples/plan.sdif
```

This produces a JSON representation of the document to stdout. Tables become arrays of objects, relations become structured objects, and directives become top-level metadata.

## Next steps

- [Concepts](/docs/concepts/overview) — directives, statements, tables, relations, canonical form
- [Spec](/docs/spec) — complete language reference
- [CLI Reference](./guides/cli.md) — all commands and flags
- [Guides](./guides/install.md) — install options, schema validation, AI projections
