---
title: "Efficiency Formalization"
sidebar_position: 1
---

# SDIF Efficiency Formalization

This page defines a non-normative model for reasoning about SDIF's structural, token, and semantic efficiency compared to compact JSON and other text formats. It does not modify the SDIF specification.

## Core idea

SDIF reduces repeated structural overhead by declaring table columns once, representing relations as compact triples, and making canonical structure explicit. This page formalizes the conditions under which those reductions produce measurable savings.

## Cost model

Let:

- `B_json(x)` = UTF-8 byte size of compact JSON for document `x`
- `B_sdif(x)` = UTF-8 byte size of SDIF source for document `x`
- `T_json(x)` = token count of compact JSON (tokenizer-dependent)
- `T_sdif(x)` = token count of SDIF source (tokenizer-dependent)
- `F(x)` = number of semantic facts in `x` (field values + relation triples)

Derived metrics:

```
byte_delta(x)      = B_json(x) - B_sdif(x)       # positive → SDIF smaller
token_delta(x)     = T_json(x) - T_sdif(x)        # positive → SDIF smaller
semantic_density(x) = T(x) / F(x)                 # tokens per fact; lower is better
```

Token counts must be compared within the same tokenizer. Results across tokenizers are not comparable.

## Repeated record model

For a table with `r` rows and `c` columns, JSON-encoded as an array of objects:

- JSON structural overhead scales with `r × c` repeated key strings.
- SDIF structural overhead scales with `c` column names declared once in the header.

As `r` increases, SDIF's advantage grows linearly. As column names get longer, the advantage per row increases. As `c` increases, the per-row savings multiply.

## Relation model

JSON has no native triple syntax. A relation is typically encoded as:

```json
{"subject": "R3", "predicate": "depends_on", "object": "R2"}
```

SDIF expresses the same fact as:

```
rel:
  R3 depends_on R2
```

Each SDIF relation triple occupies fewer tokens than its JSON equivalent because the field names (`subject`, `predicate`, `object`) are implicit rather than repeated per triple.

## Where SDIF is strongest

| Document shape             | Expected SDIF advantage | Reason                               |
|----------------------------|------------------------|--------------------------------------|
| Tiny one-off objects       | Low                    | Header cost dominates                |
| Flat single records        | Mixed                  | Depends on field count and name length |
| Repeated records (tables)  | High                   | Columns declared once                |
| Relation-heavy documents   | High                   | Native triples, no key repetition    |
| Canonical workflows        | High                   | Deterministic bytes + stable hash    |
| Deep irregular nesting     | Mixed                  | JSON/YAML may be more natural        |

## Important limitation

SDIF is not always smaller than JSON. It is designed for compact, semantic, canonicalizable interchange — not for minimizing byte count in every possible document shape. For deeply nested irregular objects where no columns repeat, the SDIF header overhead may exceed JSON's key repetition cost.

The benchmark corpus covers four structured example documents. Results for other document shapes may differ. See [Methodology](./methodology) for the corpus definition and [Reproduce](./reproduce) for instructions to run the benchmark on your own data.

## Conclusion

SDIF's primary advantage is more machine-meaningful structure per token, especially for repeated records, relations, AI context windows, and deterministic workflows. Byte and token savings are a consequence of that structure, not the primary design goal.
