---
title: "Validation Report Example"
sidebar_position: 4
---

# Validation Report Example

## What this example shows

This example demonstrates a `ValidationReport` document — a machine-readable record of a single validator run against a named SDIF document.

Key concepts covered:

- `ValidationReport` kind captures validator output in a stable, auditable form
- Scalar fields (`status`, `checked_at`, `schema_used`) record the outcome and context of the run
- A `diagnostics` table stores structured error and warning rows with severity, rule, message, and source location
- Relations link the report back to the document that was validated and the schema that was applied
- The format is deterministic: the same document and schema always produce the same report, making it safe to hash, diff, and track in version control

## JSON source

```json
{
  "sdif": "1.0",
  "kind": "ValidationReport",
  "id": "validation.report.plan.v2.20260520",
  "schema": "sdif.validation_report.v1",
  "authority": "Canonical",
  "lifecycle": "Active",
  "status": "failed",
  "checked_at": "2026-05-20T18:30:00Z",
  "schema_used": "example.plan.v1",
  "diagnostics": [
    {
      "id": "D1",
      "severity": "error",
      "rule": "deny missing(evidence)",
      "message": "Milestone R3 has no evidence path",
      "location": "milestones:R3:evidence"
    },
    {
      "id": "D2",
      "severity": "error",
      "rule": "deny missing(evidence)",
      "message": "Milestone R4 has no evidence path",
      "location": "milestones:R4:evidence"
    },
    {
      "id": "D3",
      "severity": "warning",
      "rule": "warn eq(authority,Unknown)",
      "message": "Field authority is Unknown; expected Canonical",
      "location": "authority"
    }
  ],
  "relations": [
    ["validation.report.plan.v2.20260520", "validates", "release.v2.validation_plan"],
    ["validation.report.plan.v2.20260520", "applied_schema", "example.plan.v1"]
  ]
}
```

## SDIF

```
@sdif 1.0
@profile source
kind ValidationReport
id validation.report.plan.v2.20260520
schema sdif.validation_report.v1
authority Canonical
lifecycle Active
status failed
checked_at 2026-05-20T18:30:00Z
schema_used example.plan.v1

diagnostics[id,severity,rule,message,location]:
  D1	error	deny missing(evidence)	Milestone R3 has no evidence path	milestones:R3:evidence
  D2	error	deny missing(evidence)	Milestone R4 has no evidence path	milestones:R4:evidence
  D3	warning	warn eq(authority,Unknown)	Field authority is Unknown; expected Canonical	authority

rel:
  validation.report.plan.v2.20260520 validates release.v2.validation_plan
  validation.report.plan.v2.20260520 applied_schema example.plan.v1
```

## Notes

**`ValidationReport` kind and `status`**

`status` is one of `passed` or `failed`. A report with zero error-severity diagnostics has `status passed`. Any error diagnostic — regardless of warning count — sets `status failed`. Consumers running deterministic workflows can gate on `status` alone without parsing the `diagnostics` table.

**`diagnostics` table**

Five columns capture the full context of each finding:

- `id` — a stable row identifier (`D1`, `D2`, ...) that can be referenced from relations or downstream reports
- `severity` — `error` blocks the workflow; `warning` is advisory
- `rule` — the exact rule expression from the `rules:` block that triggered this diagnostic; reproducible from the source document
- `message` — a human-readable description of the finding
- `location` — a colon-separated path identifying where in the document the violation was found (`table:row:column` or bare field name)

**Relations**

Two predicates connect the report to the artifacts it concerns:

- `validates` — links this report to the document that was validated; the object is the validated document's `id`
- `applied_schema` — records which schema was in effect during the run; useful when schemas evolve and older reports must remain interpretable

These triples make the report self-contained: a reader can reconstruct the full validation provenance without inspecting the source document.

**Determinism and hashing**

Because the `diagnostics` table rows are derived entirely from the source document and the schema, the same inputs always produce the same report. Hashing the canonical form of a `ValidationReport` gives a stable fingerprint for audit trails and change detection.

## Try it locally

```bash
# Validate a document and write the report to disk
sdif validate plan.sdif --schema schema.sdif --report report.sdif

# Validate and emit the report as JSON
sdif validate plan.sdif --schema schema.sdif --report - --json

# Parse the report as a standalone SDIF document
sdif parse report.sdif

# Convert the report to JSON
sdif to-json report.sdif
```
