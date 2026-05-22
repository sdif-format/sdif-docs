---
title: "Conformance"
sidebar_position: 10
---

# Conformance

This page defines the conformance requirements for SDIF 1.0 implementations and the layout of the conformance test fixture suite.

## Conformance Levels

An implementation MAY claim conformance to one or more of the following levels:

| Level | Description |
|---|---|
| **Parser** | Correctly parses valid SDIF source documents and rejects invalid ones |
| **Canonicalizer** | Produces canonical bytes matching golden fixtures for all valid inputs |
| **Hasher** | Computes SHA-256 document hashes matching `.sha256` golden files |
| **AI projection** | Produces and ingests `.sdif.ai` documents with correct round-trip behavior |

An implementation that claims full SDIF 1.0 conformance MUST satisfy all four levels.

## Fixture Layout

Conformance test fixtures are located in the SDIF repository under the `conformance/` directory. The directory is organized as follows:

```
conformance/
  valid/           # Documents that parsers MUST accept
  invalid/         # Documents that parsers MUST reject
  canonical/       # Source + expected canonical output + expected hash
    *.sdif         # Source input
    *.sdif.canon   # Expected canonical bytes (golden)
    *.sha256       # Expected SHA-256 hash (64-char lowercase hex)
  ai/              # AI projection round-trip fixtures
    *.sdif         # Source input
    *.sdif.ai      # Expected AI projection output (golden)
    *.sha256       # Hash that the round-trip MUST reproduce
```

## Parser Conformance

An implementation claiming Parser conformance MUST:

1. **Accept all fixtures** under `conformance/valid/`. For each fixture, the parser MUST successfully produce an AST without errors or warnings that would cause the parse to fail.
2. **Reject all fixtures** under `conformance/invalid/`. For each fixture, the parser MUST report at least one parse error. The error MUST be reported with enough information to identify the location (line number SHOULD be included).
3. **Normalize CRLF to LF** on parse, as required by [Lexical Structure](./lexical-structure.md). A document that is otherwise valid but uses CRLF line endings MUST be accepted and parsed identically to its LF-normalized form.
4. **Reject invalid UTF-8** byte sequences with a parse error.

## Canonicalizer Conformance

An implementation claiming Canonicalizer conformance MUST:

1. **Produce matching canonical bytes** for every fixture pair in `conformance/canonical/`. For each `*.sdif` source file, the implementation MUST produce canonical output that is byte-for-byte identical to the corresponding `*.sdif.canon` golden file.
2. **Be idempotent**: `canon(canon(x))` MUST equal `canon(x)` for all valid fixtures. Implementations SHOULD verify this property by running the canonicalizer twice on each fixture.
3. **Report canonicalization errors** for fixtures that include `ordered: false` tables with no `primary_key`, as described in [Canonicalization Rule 11](./canonicalization.md#rule-11--sort-schema-unordered-table-rows-by-primary-key). The implementation MUST report an error and MUST NOT emit partial canonical output for such documents.
4. **Respect all 13 normative rules** defined in [Canonicalization](./canonicalization.md).

## Hash Conformance

An implementation claiming Hasher conformance MUST:

1. **Produce matching hashes** for every `*.sha256` file in `conformance/canonical/`. The computed SHA-256 hash, expressed as a 64-character lowercase hexadecimal string, MUST be byte-for-byte identical to the content of the corresponding `.sha256` file.
2. Hashes MUST be computed over the **canonical UTF-8 bytes** as produced by the canonicalizer, not over source bytes.

## AI Projection Conformance

An implementation claiming AI projection conformance MUST:

1. **Produce matching AI projection output** for every `*.sdif.ai` golden file in `conformance/ai/`. The AI projection of each `*.sdif` source file MUST be byte-for-byte identical to the corresponding golden.
2. **Satisfy the round-trip requirement**: For every fixture in `conformance/ai/`, the following MUST hold:

   ```
   hash(canon(sdif_from_ai(ai_view(source)))) == hash(canon(source))
   ```

   That is, applying the AI projection and then reversing it back to canonical SDIF MUST yield a document with the same canonical hash as the original source. Implementations MUST verify this equality against the `*.sha256` file.
3. **Reject `rel[subject]:` syntax in source-profile documents**. Grouped relation syntax is valid only in `@sdif.ai` documents and MUST be treated as a parse error in `@sdif` documents.

## Fixture Authoring Guidelines

New fixtures added to the conformance suite SHOULD follow these guidelines:

- **Valid fixtures** MUST include a comment (stripped in canonical form) describing the feature being tested.
- **Invalid fixtures** MUST be accompanied by a `*.expected-error` sidecar file containing the expected error message or error code.
- **Canonical golden files** MUST be generated by the reference implementation and verified by at least one independent implementation before being merged.
- All fixture files MUST use LF line endings and UTF-8 encoding in the repository.

## Reporting Non-Conformance

Implementations that discover divergence from these conformance requirements SHOULD:

1. File an issue in the SDIF repository with the fixture name, the actual output, and the expected output.
2. Include the implementation name, version, and platform in the report.
3. Attach the minimal reproducing fixture if it is not already in the conformance suite.
