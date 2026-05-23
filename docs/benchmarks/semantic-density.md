---
title: "Semantic Density"
sidebar_position: 4
---

# Semantic Density

Semantic density measures how much data content a format delivers per token, as opposed to how many tokens it spends on structural overhead. It is a different dimension from raw token efficiency: a format can be compact in tokens while still being low in semantic density if most of those tokens encode delimiters, keys, or scaffolding rather than values.

## What it measures

Token count measures total cost. Semantic density asks what you get for that cost. The distinction matters when comparing formats that have different structural profiles: a format that uses fewer tokens but expresses a smaller set of semantic relationships is not necessarily better for AI-facing data exchange.

Semantic density is not a single number — it is a property that varies by document type. A document that is mostly tabular data has a different density profile than one that is mostly relational graph data or narrative text.

## Structural advantages in tabular data

SDIF's primary structural advantage over JSON and YAML for tabular data is key elimination. In a JSON array of objects, every row repeats every column name as a quoted string key. A table with 8 columns and 200 rows repeats those 8 keys 200 times each. None of those repetitions carry new information — they are structural cost with no semantic return.

SDIF writes column names once in the table header. Each subsequent row contains only values, separated by tab characters. The column names are unambiguous because their position maps to the header. This means that as a table grows in rows, the structural overhead stays constant while the data content scales linearly. The ratio of information to total tokens improves as the table grows.

## Relation density

SDIF expresses directed triples natively using `rel:` blocks. Each triple encodes a subject, a predicate, and an object. In JSON, an equivalent graph structure requires nested objects or arrays: the subject becomes an object key or a field, the predicate becomes a nested key, and the object becomes a nested value. That nesting costs tokens at each level of structure.

The SDIF `rel:` syntax expresses the same triple with minimal structural markers. For documents with substantial relational content — such as knowledge graphs, entity-relationship data, or link sets — this difference in representation density accumulates across every triple in the document.

## Schema as a density multiplier

An SDIF schema document adds type declarations and constraints alongside the data it describes. A field type declaration does not increase the size of any data row — the schema is a separate structural layer. This means that a schema-annotated SDIF document carries more semantics per data token than the same document without a schema, because the schema provides type and constraint information that would otherwise need to be inferred or communicated separately.

In JSON, schema validation requires a separate specification (JSON Schema) and a separate validation pass. The schema does not travel with the data in a standard way. SDIF integrates schema as a first-class structural element, which means the semantic density of a schema-annotated SDIF document accounts for the full type system without requiring additional tokens in each data row.

## When structural advantages do not apply

Semantic density advantages are tied to document structure. They are largest when:

- Tables are wide (many columns) and tall (many rows).
- Relational content is dense relative to document size.
- The same schema applies across many rows.

They are smaller when:

- Documents have few rows or a single row per object.
- Data is mostly scalar or narrative with no tabular structure.
- Relational content is sparse.

Sparse documents — those with many columns where most cells are empty or absent — benefit less, because SDIF still writes headers for all declared columns even if most cells carry no value. SDIF AI partially addresses this by omitting null and default-value fields from its projection.

## Current results

Semantic density analysis for the benchmark corpus is available in the [sdif-benchmarks](https://github.com/sdif-format/sdif-benchmarks) repository. Results are organized by document type and format to show how density varies with document structure.
