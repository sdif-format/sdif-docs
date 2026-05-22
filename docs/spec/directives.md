---
title: "Directives"
sidebar_position: 2
---

# Directives

Directives are the first non-blank, non-comment line of every SDIF document. They declare the profile and version.

## `@sdif`

```
@sdif 1.0
```

Declares a Source or Canonical document. Version **MUST** be `1.0`.

## `@sdif.ai`

```
@sdif.ai 1.0
```

Declares an AI projection document. Enables AI-only syntax extensions (`rel[subject]:` grouped relations, `alias:` declarations).

## `@profile`

```
@profile canonical-syntax-v1
```

Optional secondary directive. When present on a `@sdif 1.0` document, the document **MUST** conform to all canonicalization constraints defined in [Canonicalization](./canonicalization.md).

## Rules

- Exactly one profile directive **MUST** appear as the first non-blank, non-comment line.
- `@sdif.ai` documents **MUST NOT** include `@profile canonical-syntax-v1`.
- Unknown directives **MUST** cause a parse error unless a future version of this specification defines them.
