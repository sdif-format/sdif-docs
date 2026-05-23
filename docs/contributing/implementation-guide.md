---
title: "Implementation Guide"
sidebar_position: 2
---

# Implementation Guide

This page is for developers building an SDIF parser or serializer in a language other than Python. The reference implementation lives at [github.com/sdif-format/sdif](https://github.com/sdif-format/sdif) and is the normative source for correct behavior.

## Parse Pipeline

A complete SDIF implementation covers four stages:

1. **Bytes to tokens** — read the UTF-8 source with LF line endings. Identify the `@sdif 1.0` header, block delimiters, table headers, and relation blocks.
2. **Tokens to AST** — build a structured representation of the document: its tables (with column names and rows), its `rel:` blocks (with subject-predicate-object triples), and any narrative sections.
3. **AST to canonical form** — serialize the AST into the `canonical-syntax-v1` profile. The canonical form has deterministic ordering and whitespace rules. The output must exactly match the reference implementation's output to pass conformance tests.
4. **Canonical form to hash** — compute the SHA-256 of the canonical bytes. This hash is the document's stable identity.

## Key Parsing Challenges

Several aspects of SDIF require careful handling:

**HTAB-separated table rows.** Table rows use the horizontal tab character (`\t`, U+0009) as the column separator. Parsers must distinguish between leading whitespace (indentation) and the intra-row tab separators. Do not strip or normalize tabs inside rows.

**Triple-quoted narratives.** Narrative sections use triple-quote delimiters. The content between them may span multiple lines and may contain characters that would otherwise be significant in the format. Treat the content as a literal block.

**Multiple `rel:` blocks.** A single SDIF document may contain more than one `rel:` block. The triples from all `rel:` blocks in a document are merged into a single set of relations when constructing the canonical form. Duplicate triples should be deduplicated.

**Canonical ordering rules.** The canonical form imposes a specific ordering on tables and relations. Implement this ordering exactly. Any deviation will produce a different canonical hash and cause conformance failures.

## Reference Material

The format specification pages in this documentation describe each construct in detail. For authoritative behavior, read the reference implementation source alongside the spec. When the two appear to conflict, open an issue — the discrepancy should be resolved, not silently ignored.

## Running Conformance Tests

Before considering an implementation complete, run it against the conformance suite. The conformance suite covers parsing, canonicalization, hashing, schema validation, and round-trip conversion. See the [Conformance Suite](./conformance-suite) page for details.
