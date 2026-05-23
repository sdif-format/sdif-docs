---
title: "Create an SDIF AI Projection"
sidebar_position: 7
---

# Create an SDIF AI Projection

An SDIF AI projection is a compact derived representation of an SDIF document, stored with the `.sdif.ai` extension and headed by `@sdif.ai 1.0`. It uses grouped relation syntax and a condensed field layout to reduce token count while preserving all semantic content. The source `.sdif` file remains authoritative — the projection is always derived from it.

---

## 1. Start with a source SDIF document

The input to `sdif ai` is any well-formed `.sdif` file. For this guide, use `plan.sdif`:

```
@sdif 1.0
kind Plan
id release.v2.validation_plan
schema example.plan.v1
authority Canonical
lifecycle Active
status open
priority P0
owner team.platform
title "Release v2 validation plan"

milestones[id,status,gate,evidence]:
	R1	done	validate-syntax	reports/syntax.md
	R2	done	validate-canonical	reports/canonical.md
	R3	pending	validate-schema	reports/schema.md

rel:
	R3 depends_on R2
	release.v2.validation_plan validated_by validation.report.v2
```

---

## 2. Generate the AI projection

```bash
sdif ai plan.sdif
```

The command writes the `.sdif.ai` projection to stdout. The output uses `@sdif.ai 1.0` as its header and groups relations by subject using the `rel[subject]:` syntax:

```
@sdif.ai 1.0
kind Plan
id release.v2.validation_plan
schema example.plan.v1
authority Canonical
lifecycle Active
status open
priority P0
owner team.platform
title "Release v2 validation plan"

milestones[id,status,gate,evidence]:
	R1	done	validate-syntax	reports/syntax.md
	R2	done	validate-canonical	reports/canonical.md
	R3	pending	validate-schema	reports/schema.md

rel[R3]:
	depends_on R2

rel[release.v2.validation_plan]:
	validated_by validation.report.v2
```

Relations are grouped under their subject identifier. Each group opens with `rel[subject]:` and lists one `predicate object` pair per indented line. This eliminates per-relation subject repetition and reduces token count on documents with many relations.

---

## 3. Optional: include alias declarations

The `--alias` flag replaces field names with shorter tokens in the projection. Each alias is written as `FIELD=ALIAS`:

```bash
sdif ai plan.sdif --alias status=s --alias priority=p
```

The resulting projection records the alias mapping so the reversal step can expand them back. Use aliases when field names are long and appear many times across tables or relations.

---

## 4. Save to a file

Redirect stdout to write the projection alongside the source document:

```bash
sdif ai plan.sdif > plan.sdif.ai
```

By convention, AI projections use the `.sdif.ai` extension and live next to the source file they were derived from.

---

## 5. Reverse the projection back to canonical SDIF

```bash
sdif from-ai plan.sdif.ai
```

This expands grouped relations back to flat form, substitutes any aliases with their original field names, and emits canonical SDIF to stdout. The result is semantically equivalent to running `sdif canon` on the original source.

To save it:

```bash
sdif from-ai plan.sdif.ai > plan.recovered.sdif
```

---

## 6. Verify round-trip fidelity with hashes

The hash of the canonical source and the hash of the recovered document should match. Use `sdif hash` to confirm:

```bash
sdif hash plan.sdif --schema schemas/plan.schema.sdif
# sha256:a3f1c2d8...

sdif from-ai plan.sdif.ai | sdif hash /dev/stdin
# sha256:a3f1c2d8...
```

Matching hashes confirm that no semantic content was lost in the projection and reversal.

---

## 7. What the AI projection preserves and what it does not

| Preserved | Not preserved |
|---|---|
| All field values | Source comments |
| All table rows and columns | Source whitespace and formatting |
| All relations (subject, predicate, object) | Original field ordering if aliases are renamed |
| Enum values and identifiers | |

The projection is optimized for model context windows, not for human editing. Always treat the source `.sdif` as the authoritative record and regenerate the projection from it when the source changes.

---

## 8. When to use AI projections

- Passing structured SDIF data to a language model where token budget is constrained
- Reducing repeated field names in documents with wide tables or many relations
- Providing a model with a compact view of a document while keeping the source as ground truth

For a quick token count of any file without generating a full projection, use:

```bash
sdif tokens plan.sdif
```

This reports byte size and estimated token count for the source document without producing a `.sdif.ai` file.
