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
  manifest.sdif         # Portable fixture index (SDIF document, kind ConformanceManifest)
  cases/                # Named valid-case fixtures
    <case-id>/
      source.sdif       # Source input (may use non-canonical form)
      canonical.sdif    # Expected canonical bytes (golden)
      expected.tree     # Expected parse tree (implementation-defined text format)
  invalid/              # Documents that parsers MUST reject
    <fixture>.sdif      # One file per error condition
```

### The manifest

`conformance/manifest.sdif` is the authoritative index of the conformance suite. It is itself a valid SDIF document and can be parsed by any conforming implementation without a JSON adapter.

```sdif
@sdif 1.0
kind ConformanceManifest
version 1.0.0
cases[id,profile,source,canonical,tree,sha256]:
  core-agent    v1  conformance/cases/core-agent/source.sdif  ...
  ai-alias-header  ai  conformance/cases/ai-alias-header/source.sdif  ...
invalid_cases[id,source,expected_code]:
  version-missing    conformance/invalid/version_missing.sdif    SDIF_VERSION_MISSING
  table-too-few-cells  conformance/invalid/table_too_few_cells.sdif  SDIF_TABLE_ARITY
  scalar-unclosed-quote  conformance/invalid/scalar_unclosed_quote.sdif  SDIF_STRING_UNCLOSED
  ...
```

The `cases` table covers valid round-trip cases. Each row declares:
- `id` — unique case identifier
- `profile` — `v1` (source-profile) or `ai` (AI-profile)
- `source` — repo-relative path to source file
- `canonical` — repo-relative path to canonical golden
- `tree` — repo-relative path to expected parse tree
- `sha256` — 64-char lowercase hex of `SHA-256(canonical UTF-8 bytes)`

The `invalid_cases` table covers rejection cases. Each row declares:
- `id` — unique case identifier
- `source` — repo-relative path to the invalid fixture
- `expected_code` — the error code the parser MUST raise (e.g. `SDIF_VERSION_MISSING`)

## Parser Conformance

An implementation claiming Parser conformance MUST:

1. **Accept all cases** listed in the `cases` table of `conformance/manifest.sdif`. For each case, the parser MUST successfully produce an AST without errors or warnings that would cause the parse to fail.
2. **Reject all fixtures** listed in the `invalid_cases` table of `conformance/manifest.sdif`. For each fixture, the parser MUST report a parse error whose code matches the `expected_code` column. The error MUST be reported with enough information to identify the location (line number SHOULD be included).
3. **Normalize CRLF to LF** on parse, as required by [Lexical Structure](./lexical-structure.md). A document that is otherwise valid but uses CRLF line endings MUST be accepted and parsed identically to its LF-normalized form.
4. **Reject invalid UTF-8** byte sequences with a parse error.

## Canonicalizer Conformance

An implementation claiming Canonicalizer conformance MUST:

1. **Produce matching canonical bytes** for every case in the `cases` table of `conformance/manifest.sdif`. For each `source` file, the implementation MUST produce canonical output that is byte-for-byte identical to the corresponding `canonical` golden file.
2. **Be idempotent**: `canon(canon(x))` MUST equal `canon(x)` for all valid fixtures. Implementations SHOULD verify this property by running the canonicalizer twice on each fixture.
3. **Report canonicalization errors** for fixtures that include `ordered: false` tables with no `primary_key`, as described in [Canonicalization Rule 11](./canonicalization.md#rule-11--sort-schema-unordered-table-rows-by-primary-key). The implementation MUST report an error and MUST NOT emit partial canonical output for such documents.
4. **Respect all 13 normative rules** defined in [Canonicalization](./canonicalization.md).

## Hash Conformance

An implementation claiming Hasher conformance MUST:

1. **Produce matching hashes** for every case in the `cases` table of `conformance/manifest.sdif`. The computed SHA-256 hash, expressed as a 64-character lowercase hexadecimal string, MUST be identical to the `sha256` column value for that case.
2. Hashes MUST be computed over the **canonical UTF-8 bytes** as produced by the canonicalizer, not over source bytes.

## AI Projection Conformance

An implementation claiming AI projection conformance MUST:

1. **Produce matching canonical output** for every case with profile `ai` in the `cases` table of `conformance/manifest.sdif`. The AI projection round-tripped back to canonical SDIF MUST match the `canonical` golden file for that case.
2. **Satisfy the round-trip requirement**: For every AI-profile case in the manifest, the following MUST hold:

   ```
   hash(canon(sdif_from_ai(ai_view(source)))) == hash(canon(source))
   ```

   That is, applying the AI projection and then reversing it back to canonical SDIF MUST yield a document with the same canonical hash as the original source. Implementations MUST verify this equality against the `*.sha256` file.
3. **Reject `rel[subject]:` syntax in source-profile documents**. Grouped relation syntax is valid only in `@sdif.ai` documents and MUST be treated as a parse error in `@sdif` documents.

## Fixture Authoring Guidelines

New fixtures added to the conformance suite SHOULD follow these guidelines:

- **Valid case fixtures** (`conformance/cases/<id>/`) MUST include `source.sdif`, `canonical.sdif`, and `expected.tree`. The canonical file MUST be generated by the reference Python implementation. The case MUST be registered in the `cases` table of `conformance/manifest.sdif` with a correct `sha256` value.
- **Invalid fixtures** (`conformance/invalid/<name>.sdif`) MUST be registered in the `invalid_cases` table of `conformance/manifest.sdif` with the `expected_code` that the parser MUST raise. No sidecar files are required.
- **Canonical golden files** MUST be generated by the reference implementation and verified by `scripts/check_conformance_fixtures.py` before being merged.
- All fixture files MUST use LF line endings and UTF-8 encoding in the repository.

## Reporting Non-Conformance

Implementations that discover divergence from these conformance requirements SHOULD:

1. File an issue in the SDIF repository with the fixture name, the actual output, and the expected output.
2. Include the implementation name, version, and platform in the report.
3. Attach the minimal reproducing fixture if it is not already in the conformance suite.
