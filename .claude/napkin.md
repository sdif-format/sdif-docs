# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)
1. **[2026-05-22] New repo commit organization**
   Do instead: inspect staged/unstaged scope first, group commits by coherent code/docs/config domains, and avoid mixing generated/build outputs unless explicitly intended.

## Shell & Command Reliability
1. **[2026-05-22] Prefer non-destructive git inspection first**
   Do instead: run `git status --short`, `git diff --stat`, and targeted diffs before staging or committing.

## Domain Behavior Guardrails
1. **[2026-05-22] SDIF docs repo may mirror broader SDIF decisions**
   Do instead: check local docs/config before assuming this repo has the same guards as the main SDIF repo.

## User Directives
1. **[2026-05-22] Commit grouping by meaning and scope**
   Do instead: create multiple focused commits grouped by code meaning and affected area, not one broad initial dump.
