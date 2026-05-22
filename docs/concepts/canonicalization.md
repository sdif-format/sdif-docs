---
title: "Canonicalization"
sidebar_position: 9
---

# Canonicalization

Canonicalization transforms a source SDIF document into a deterministic byte sequence. Two documents that represent the same data — regardless of formatting, comment style, or authoring order — produce identical canonical bytes, and therefore an identical SHA-256 hash.

## Why It Matters

**Stable hashing.** The SHA-256 of a canonical SDIF document is a stable, portable document identity. Store the hash alongside the document; recompute it later to detect tampering or drift.

**Signing.** Digital signatures require a fixed byte sequence. Canonical form is the signing surface for SDIF documents.

**Cache keys.** Systems that cache document-derived computations (validations, projections, embeddings) use the canonical hash as the cache key. Two source files with different whitespace but the same content hit the same cache entry.

**Reproducible comparisons.** Diffing two canonical SDIF files reveals only meaningful semantic differences, not formatting noise.

## The Pipeline

```
source.sdif → parser → AST → canonicalizer → canonical bytes → SHA-256
```

1. **Parser** reads the source file, tolerating comments, blank lines, and stylistic variation.
2. **AST** is the language-independent representation of the document's content.
3. **Canonicalizer** renders the AST to bytes according to strict rules.
4. **SHA-256** is computed over the canonical bytes.

The canonical bytes are written to a `.sdif.canon` file. The hash is typically stored in a sidecar or embedded as a directive.

## What Canonical Form Removes

The canonicalizer strips everything that does not carry semantic meaning:

- **Comments** — any line beginning with `#` or inline `#` remarks
- **Blank lines** — empty lines between blocks
- **Stylistic whitespace** — leading/trailing spaces on lines, inconsistent indentation

After canonicalization, two source files that differ only in these elements are byte-for-byte identical.

## What Canonical Form Normalizes

Beyond stripping noise, the canonicalizer applies deterministic ordering and formatting rules:

**Directive order.** The version header (`@sdif`) appears first, followed by `@profile canonical`, followed by `kind`, followed by all other directives in a fixed order.

**Common fields first.** The canonical field order within a document type is: `id`, `schema`, then remaining declared fields in schema-declaration order.

**Two-space indentation.** All table rows and relation triples are indented with exactly two spaces, regardless of how they were indented in the source.

**HTAB separators.** Column values in table rows are separated by exactly one U+0009 HORIZONTAL TAB. Multiple tabs or spaces between values are not permitted in canonical form.

**Sorted relations.** All triples in `rel:` blocks are sorted lexicographically by `(subject, predicate, object)`. Multiple source `rel:` blocks are merged into one.

**Sorted rules.** Rule expressions within `rules:` blocks are sorted lexicographically.

## Schema-Aware Row Ordering

Table row ordering in canonical form depends on the schema:

| Schema says | Behavior |
|---|---|
| `ordered=false` + `primary_key` declared | Rows sorted by primary key value, lexicographically |
| `ordered=true` | Row order preserved exactly as in source |
| No schema available | Row order preserved (treated as ordered) |

This means two source files with the same unordered table rows but written in different insertion order produce identical canonical bytes, as long as the schema declares `ordered=false`.

## The Canonical Syntax Contract

The rules above are versioned under the contract identifier `canonical-syntax-v1`. Future versions of SDIF may introduce `canonical-syntax-v2` with updated rules. Documents declare which contract their canonical form targets via the `@profile canonical` directive.

## What Canonicalization Does Not Do

Version 1 canonicalization is **syntax-level only**. It does not perform semantic normalization. Specifically:

- `1.0` and `1.00` are not recognized as equal numeric values — they canonicalize to their literal strings.
- Dates with and without timezone offsets are not normalized.
- Aliases in AI projections are not resolved — alias expansion is an AI-layer concern, not a canonicalization concern.
- Unit equivalences (e.g., `1kg` vs `1000g`) are not recognized.

These equivalences may be introduced in a future versioned contract with golden fixtures and a defined migration path.

## Example

Source document (with comments and inconsistent spacing):

```
@sdif 1.0
@profile source
# This plan tracks release validation
kind Plan
id release.v2.validation_plan
schema example.plan.v1
title "Release v2 validation plan"
status open

milestones[id,status,gate,evidence]:
    R2	done	validate-canonical	reports/canonical.md
    R1	done	validate-syntax	reports/syntax.md
    R4	pending	validate-semantics	reports/semantics.md
    R3	pending	validate-schema	reports/schema.md

rel:
  R4 depends_on R3
  R3 depends_on R2
```

Canonical form (after canonicalization):

```
@sdif 1.0
@profile canonical
kind Plan
id release.v2.validation_plan
schema example.plan.v1
title "Release v2 validation plan"
status open
milestones[id,status,gate,evidence]:
  R1	done	validate-syntax	reports/syntax.md
  R2	done	validate-canonical	reports/canonical.md
  R3	pending	validate-schema	reports/schema.md
  R4	pending	validate-semantics	reports/semantics.md
rel:
  R3 depends_on R2
  R4 depends_on R3
```

The comment is gone. The blank line is gone. Rows are sorted by `id` (primary key). Relations are sorted by subject then predicate.

## CLI

```bash
sdif canon plan.sdif                 # Print canonical form to stdout
sdif canon plan.sdif -o plan.sdif.canon   # Write to file
sdif hash plan.sdif                  # Print SHA-256 of canonical bytes
```
