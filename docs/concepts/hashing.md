---
title: "Hashing"
sidebar_position: 10
---

# Hashing

SDIF hashing produces a SHA-256 digest over the canonical bytes of a document. Because canonicalization is deterministic, two documents with the same semantic content — regardless of how they were formatted, what comments they contained, or in what order their rows were inserted — produce identical canonical bytes and therefore an identical hash.

The hash is the portable identity of a document's content.

## The Pipeline

```
source.sdif → parser → AST → canonicalizer → canonical bytes → SHA-256
```

1. **Parser** reads the source document, accepting comments, blank lines, and formatting variation.
2. **AST** is the language-independent in-memory representation of the document's content.
3. **Canonicalizer** renders the AST to a deterministic byte sequence (see [Canonicalization](./canonicalization.md)).
4. **SHA-256** is computed over those canonical bytes.

The hash is computed over the canonical form, not the source file. This means that editing a comment, reformatting indentation, or changing the order of unordered table rows does not change the hash. Only changes to semantic content — field values, table data, relation triples, rule expressions — change the hash.

## What the Hash Covers

The hash includes all semantic content:

- The version header and profile
- The kind declaration
- All scalar fields and their values
- All table headers, column names, and row values
- All relation triples in the `rel:` block
- All rule expressions in the `rules:` block

The hash does not cover:

- Comments (stripped during canonicalization)
- Blank lines (stripped during canonicalization)
- Formatting whitespace beyond what is semantically significant

Two source documents that differ only in comments or whitespace will produce the same hash.

## Schema-Aware vs Schema-Less Hashing

The hash depends on how the canonicalizer orders table rows, and that ordering depends on whether a schema is available.

**Without a schema**, all tables are treated as ordered: rows appear in the canonical form in the same sequence they were written in the source. Two source files with the same rows in different orders will produce different hashes.

**With a schema**, tables declared as `ordered=false` have their rows sorted by the declared primary key. Two source files with the same unordered table rows written in different orders will produce the same canonical bytes and the same hash.

For stable, insertion-order-independent hashing, use schema-aware hashing.

## CLI

Hash a document without a schema:

```bash
sdif hash plan.sdif
```

Hash a document with a schema (enables stable row ordering for unordered tables):

```bash
sdif hash plan.sdif --schema schema.sdif
```

Example output:

```
sha256:3a7f2c9d1e4b8f6a0d5c2e9b7f1a4d6c3e8f0b2a9d5c7e1f4b8a3d6c0e2f9b7
```

The output is the prefix `sha256:` followed by the hex-encoded digest. Tools that store or compare hashes should include the prefix to indicate the hash function used.

## Use Cases

**Content addressing.** Store the hash alongside the document. Later, recompute the hash to verify that the document has not changed since it was stored. This is especially useful when SDIF documents are transmitted over untrusted channels or stored in mutable locations.

**Tamper detection.** If a document is signed or notarized, the signature is computed over the canonical bytes (the same bytes the hash covers). Recomputing the hash later and comparing it to the stored value reveals whether the document has been altered since signing.

**Cache keys.** Systems that derive outputs from SDIF documents — validations, embeddings, projections, reports — can use the hash as a cache key. If the hash matches a previously computed result, the derivation can be skipped. Two source files with different whitespace but the same content share a cache entry.

**Tracking document versions.** When a document evolves over time, storing the hash at each revision provides a lightweight audit trail. A change in hash indicates a change in semantic content; no change in hash indicates the document is semantically identical to its previous version, even if it was reformatted.

## Relationship to Canonicalization

Hashing and canonicalization are closely related. Canonicalization defines the byte sequence; hashing measures it. The `sdif canon` command produces the canonical bytes as a file. The `sdif hash` command computes the hash of those bytes. Running `sdif hash` is equivalent to running `sdif canon | sha256sum`, but more convenient.

See the [Canonicalization](./canonicalization.md) page for a full description of what canonicalization normalizes and how it handles ordering.
