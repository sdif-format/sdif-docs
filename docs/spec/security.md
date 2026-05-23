---
title: "Security"
sidebar_position: 11
---

# Security

This page describes the security properties of the SDIF 1.0 format and the mitigations implementations MUST apply when parsing untrusted documents.

## No Code Execution

SDIF is a **data format only**. The format defines no mechanism for evaluating expressions, executing code, invoking external processes, or expanding macros.

- SDIF parsers MUST NOT execute any value encountered in a document.
- The `rules:` block contains constraint expressions, but these are declarative assertions evaluated by the schema validator, not arbitrary code. Rule expressions are limited to the forms defined in [Document Model — Rule Blocks](./document-model.md#rule-blocks).
- Implementations that extend SDIF with custom rule expression forms MUST NOT allow those forms to execute host-language code without explicit user opt-in outside the parser boundary.

## No External References

SDIF documents are **self-contained**. The format defines no mechanism for referencing external files, URLs, or entities.

- SDIF does not support `include` directives, URL references, or any form of external entity expansion.
- There is no XML-style entity or DOCTYPE mechanism that could be used to trigger network requests or filesystem reads from within a document.
- Parsers MUST NOT attempt to resolve any value as a URL or file path as part of parsing, even if a value resembles a URI.

## Denial-of-Service Mitigations

Parsers processing untrusted input MUST enforce resource limits to prevent denial-of-service through large or maliciously constructed documents.

Recommended limits (implementations MAY choose stricter values):

| Resource | Recommended limit |
|---|---|
| Maximum document size (bytes) | Implementation-defined; SHOULD be bounded |
| Maximum number of rows per table | Implementation-defined; SHOULD be bounded |
| Maximum string length (characters) | Implementation-defined; SHOULD be bounded |
| Maximum number of table blocks | Implementation-defined; SHOULD be bounded |
| Maximum triple count in `rel:` blocks | Implementation-defined; SHOULD be bounded |

- Parsers MUST reject documents that exceed their configured limits and MUST report a diagnostic identifying which limit was exceeded.
- Implementations SHOULD document their default limits so that consumers can make informed trust decisions.

## UTF-8 Validation

SDIF documents MUST be encoded in valid UTF-8.

- Parsers MUST reject documents that contain invalid UTF-8 byte sequences before any structural parsing begins.
- Accepting invalid byte sequences can lead to security vulnerabilities when values are passed to downstream systems that interpret byte sequences differently.

See [Lexical Structure — Encoding](./lexical-structure.md#encoding) for the full encoding requirement.

## Version Validation

The `@sdif` directive version number MUST be validated before processing begins.

- Parsers MUST reject documents whose version token is not a recognized version string. In SDIF 1.0, the only recognized version token is `1.0`.
- Processing a document under an incorrect version assumption can cause misinterpretation of structural tokens and silent data corruption.
- A document that begins with an unrecognized directive (neither `@sdif` nor `@sdif.ai`) MUST be rejected immediately.

## Tamper Detection via Canonical Hash

SDIF supports tamper detection through **canonical hashing**.

- The canonical form of a document is a deterministic byte sequence produced by the canonicalization rules defined throughout this specification.
- The SHA-256 hash of the canonical byte sequence can be computed and stored out-of-band (for example, in a manifest or in an AI-profile document header) to detect subsequent modification.
- Implementations that expose a canonical hash MUST compute it over the canonical byte sequence only, not over the source form.
- Canonical hashing does not provide authentication (it does not prove the identity of the author); it provides **integrity verification** (it proves the document has not been altered since the hash was recorded).

The round-trip contract for AI-profile documents relies on the same hash to link an `.sdif.ai` file back to its source. See [SDIF AI](./sdif-ai.md) for details.

## Schema Validation

Schema validation in SDIF 1.0 is **optional**. A parser MUST successfully parse any structurally valid SDIF document regardless of whether a schema is present or applied.

- The absence of schema validation does not affect parser security; structural parsing does not depend on type information.
- Consumers that require field presence, type constraints, or uniqueness invariants SHOULD apply schema validation as a post-parse step on trusted or untrusted input alike.
- Schema validation failures MUST be reported as diagnostics and MUST NOT cause parsers to produce partial or corrupted output.
