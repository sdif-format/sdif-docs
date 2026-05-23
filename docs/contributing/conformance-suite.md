---
title: "Conformance Suite"
sidebar_position: 3
---

# Conformance Suite

A conformance suite is a collection of test fixtures and expected outputs used to verify that an implementation behaves correctly. For SDIF, the conformance suite is the mechanism for checking whether a parser, canonicalizer, or validator produces output that agrees with the reference implementation.

The source of conformance fixtures is the [sdif-format/sdif](https://github.com/sdif-format/sdif) repository.

## What Conformance Testing Covers

The SDIF conformance suite addresses several areas:

- **Parsing** — verifying that valid SDIF documents are accepted and produce the correct AST structure, and that invalid documents are rejected with appropriate errors.
- **Canonicalization** — verifying that a parsed document serializes to the correct canonical form under the `canonical-syntax-v1` profile, including column ordering, triple deduplication, and whitespace rules.
- **Hashing** — verifying that the SHA-256 computed over the canonical bytes matches the expected value for each test document.
- **Schema validation** — verifying that documents are correctly accepted or rejected when validated against a schema.
- **Round-trip conversion** — verifying that a document converted to JSON (or from JSON) and back produces a result with a matching canonical hash.

## Structure of the Fixtures

Conformance fixtures typically consist of:

- An input SDIF document (valid or intentionally invalid).
- The expected output — either a canonical form, a hash, a validation result, or an error indication.

Fixtures are organized so that an implementation can iterate over them, run its own processing, and compare its output to the expected output.

## Running Against Your Implementation

To test an implementation against the conformance suite:

1. Clone the `sdif-format/sdif` repository and locate the conformance fixtures.
2. For each fixture, feed the input to your implementation.
3. Compare your implementation's output to the expected output.
4. Report any mismatches. A mismatch in canonicalization means the canonical hash will also disagree, so tracing failures in order (parse, then canonicalize, then hash) simplifies debugging.

Passing all conformance tests is the minimum bar for calling an implementation correct. If your implementation passes the suite but produces unexpected behavior on documents not in the suite, consider submitting those documents as new fixtures.
