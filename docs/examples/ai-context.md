---
title: "AI Context Example"
sidebar_position: 6
---

# AI Context Example

## What this example shows

This example demonstrates an `AIContext` document — a compressed project context bundle intended to be passed to an AI agent. Rather than sending raw source files, an `AIContext` distills what the agent needs: key facts, requirements with priority and status, and the dependency structure between requirements.

Key concepts covered:

- `AIContext` kind for packaging agent-ready project context
- Scalar fields (`project`, `status`, `goal`) for top-level metadata
- A compact `facts` table with two columns (`key`, `value`) for dense key-value pairs
- A `requirements` table with four columns (`id`, `priority`, `status`, `text`)
- Relations linking requirements to each other via `depends_on` and `blocks`
- The `.sdif.ai` projection strips boilerplate further and groups relations per subject, shrinking token count for model consumption

## JSON source (the JSON equivalent)

```json
{
  "sdif": "1.0",
  "kind": "AIContext",
  "id": "project.auth_service.context",
  "project": "auth-service",
  "status": "active",
  "goal": "Ship OAuth 2.0 support with refresh-token rotation by end of sprint.",
  "facts": [
    { "key": "lang", "value": "Go 1.22" },
    { "key": "repo", "value": "github.com/example/auth-service" },
    { "key": "owner", "value": "team.platform" },
    { "key": "deadline", "value": "2026-06-06" },
    { "key": "test_coverage_target", "value": "80%" }
  ],
  "requirements": [
    { "id": "R1", "priority": "P0", "status": "done",    "text": "Implement authorization code flow" },
    { "id": "R2", "priority": "P0", "status": "open",    "text": "Add refresh-token rotation with single-use enforcement" },
    { "id": "R3", "priority": "P1", "status": "open",    "text": "Expose JWKS endpoint for public key distribution" },
    { "id": "R4", "priority": "P1", "status": "blocked", "text": "Integrate token introspection endpoint" },
    { "id": "R5", "priority": "P2", "status": "open",    "text": "Write integration tests covering full OAuth flow" }
  ],
  "relations": [
    ["R2", "depends_on", "R1"],
    ["R3", "depends_on", "R1"],
    ["R4", "depends_on", "R2"],
    ["R4", "depends_on", "R3"],
    ["R2", "blocks", "R4"]
  ]
}
```

## SDIF (the source .sdif document)

```
@sdif 1.0
kind AIContext
id project.auth_service.context
project auth-service
status active
goal Ship OAuth 2.0 support with refresh-token rotation by end of sprint.

facts[key,value]:
  lang	Go 1.22
  repo	github.com/example/auth-service
  owner	team.platform
  deadline	2026-06-06
  test_coverage_target	80%

requirements[id,priority,status,text]:
  R1	P0	done	Implement authorization code flow
  R2	P0	open	Add refresh-token rotation with single-use enforcement
  R3	P1	open	Expose JWKS endpoint for public key distribution
  R4	P1	blocked	Integrate token introspection endpoint
  R5	P2	open	Write integration tests covering full OAuth flow

rel:
  R2 depends_on R1
  R3 depends_on R1
  R4 depends_on R2
  R4 depends_on R3
  R2 blocks R4
```

## SDIF AI (the .sdif.ai projection)

```
@sdif.ai 1.0
kind AIContext
id project.auth_service.context
project auth-service
status active
goal Ship OAuth 2.0 support with refresh-token rotation by end of sprint.

facts[key,value]:
  lang	Go 1.22
  repo	github.com/example/auth-service
  owner	team.platform
  deadline	2026-06-06
  test_coverage_target	80%

requirements[id,priority,status,text]:
  R1	P0	done	Implement authorization code flow
  R2	P0	open	Add refresh-token rotation with single-use enforcement
  R3	P1	open	Expose JWKS endpoint for public key distribution
  R4	P1	blocked	Integrate token introspection endpoint
  R5	P2	open	Write integration tests covering full OAuth flow

rel[R2]:
  depends_on R1
  blocks R4

rel[R3]:
  depends_on R1

rel[R4]:
  depends_on R2
  depends_on R3
```

## Notes

**`AIContext` kind**

An `AIContext` document is not a planning artifact — it is a read-only context capsule. The agent is not expected to modify it; it uses the document to orient itself before taking action. Keeping the kind distinct from `Plan` or `Registry` lets tooling strip the document from write pipelines and prevents it from being treated as an authoritative record.

**`facts` table: a two-column key-value store**

The `facts[key,value]` table is the simplest SDIF table form. Each row is a single assertion. Because SDIF tables are tab-delimited, a dense block of facts consumes far fewer tokens than a JSON object with repeated `"key":` and `"value":` strings. Agents can scan the table top-to-bottom without parsing nested structure.

**`requirements` table: four-column structured rows**

The `requirements[id,priority,status,text]` table combines a stable identifier (`id`), a triage signal (`priority`), a workflow state (`status`), and the actual requirement prose (`text`) in one line per row. The agent receives everything needed to prioritize work without separate lookups.

The `text` column appears last because SDIF does not quote or escape values — placing the free-text column at the end avoids any ambiguity with the tab delimiter.

**Relations: dependency and blocking structure**

Two predicates express the requirement graph:

- `depends_on` — `R2 depends_on R1` means R2 cannot be started until R1 is complete
- `blocks` — `R2 blocks R4` is the inverse direction, explicitly flagging that R4 is gated on R2

Stating both directions may appear redundant, but it is deliberate: an agent scanning outbound edges from R2 immediately sees that R4 is blocked without having to invert the full graph. The validator can enforce that `blocks` and `depends_on` are consistent if a `rules:` block is added.

**`.sdif.ai` projection: grouped relations**

In the source document, `rel:` is a flat list of triples. The `.sdif.ai` projection groups them by subject using `rel[subject]:` blocks. This form is more compact when a single subject has multiple outgoing edges — R4 has two `depends_on` triples which share one header line instead of repeating the subject on each row.

The projection also omits `@profile`, `schema`, `authority`, and `lifecycle` fields that carry governance metadata useful for human readers but irrelevant to an agent executing a task.

## Try it locally

```bash
sdif parse ai-context.sdif
sdif to-json ai-context.sdif
sdif project ai-context.sdif --format ai
```
