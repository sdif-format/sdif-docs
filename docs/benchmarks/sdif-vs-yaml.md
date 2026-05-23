---
title: "SDIF vs YAML"
sidebar_position: 7
---

# SDIF vs YAML

YAML is commonly used for configuration files and human-authored documents. It is more readable than JSON for some document structures and supports features like comments and multi-line strings. This comparison examines how YAML's structural properties affect token efficiency and semantic density relative to SDIF, and where each format is better suited.

## Key repetition in sequences

YAML sequences of mappings have the same structural inefficiency as JSON arrays of objects for tabular data. Each mapping in a sequence repeats all of its keys:

```yaml
users:
  - name: Alice
    role: admin
    active: true
  - name: Bob
    role: user
    active: true
```

Each entry repeats `name`, `role`, and `active` regardless of how many entries follow. This is the same pattern as JSON key repetition. The token cost scales with the number of rows in the sequence, not just the number of columns.

SDIF writes column names once in the table header. The key repetition problem does not occur in SDIF table syntax.

## Anchors and aliases

YAML provides anchors (`&`) and aliases (`*`) as a mechanism to reduce repetition within a document. An anchor marks a node, and an alias references it elsewhere. This can reduce redundancy for repeated sub-structures.

However, anchors address a different problem than column headers: they are for reusing values or sub-trees, not for eliminating structural key-per-row cost in sequences. A YAML sequence of mappings with anchored values still repeats the mapping keys on every entry. Anchors also add parser complexity — YAML parsers must handle the anchor/alias graph, which is one source of the well-known complexity of the YAML specification.

SDIF has no equivalent of anchors. It addresses repetition at the structural level by separating column declarations from row data.

## Canonical form and hashing

YAML has no normative canonical form. Different serializers produce different byte sequences for the same data. There is no standard mechanism to hash a YAML document in a way that produces the same hash for two semantically equivalent documents.

SDIF has a normative canonical form and a defined hash (`sdif hash` over `sdif canon` output). This matters for any workflow that needs to detect whether data has changed, deduplicate documents, or verify data integrity across systems.

## Type strictness

YAML performs implicit type coercion: unquoted strings that look like booleans, numbers, or null values are silently converted. The string `yes` becomes a boolean in some YAML versions. The string `1.0` becomes a float. This behavior has been a source of real-world bugs in configuration files and data pipelines.

SDIF is strict. Values are typed by schema declaration, not by syntactic inference. A string is a string unless a schema declaration says otherwise, and there is no silent coercion based on how a value happens to look.

## Human authoring vs data exchange

YAML is designed with human authoring in mind: it is readable, supports comments, allows flexible quoting, and tolerates inconsistent formatting. These properties are valuable for configuration files that people edit by hand.

SDIF is designed for data exchange, particularly with AI systems. It prioritizes determinism, canonical form, and compact token representation. These properties matter less for human-authored config and more for programmatic data pipelines and LLM context management.

The two formats serve different primary use cases, and the token efficiency comparison is most meaningful in contexts where SDIF is actually applicable — tabular data, relational data, and documents fed to language models.

## Limitations

- **SDIF does not support comments.** YAML's comment syntax is useful for annotated configuration. SDIF has no equivalent.
- **YAML anchors can win on specific documents.** A YAML document with heavy anchor usage for shared sub-structures may be more compact than an SDIF document that does not use a compact relational representation for the same content.
- **Tokenizer behavior on YAML indentation.** YAML uses significant whitespace for structure. Indentation tokens vary by depth; deeper structures pay more per field.

## Current results

Token counts comparing YAML and SDIF across the benchmark corpus are available in the [sdif-benchmarks](https://github.com/sdif-format/sdif-benchmarks) repository.
