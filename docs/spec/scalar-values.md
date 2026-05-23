---
title: "Scalar Values"
sidebar_position: 4
---

# Scalar Values

A **scalar value** is a single-field text value associated with a named key. Scalar fields are the primary mechanism for attaching named attributes to an SDIF document. This page defines the three value forms, their syntax rules, and the special `null` literal.

For the character-level rules that underpin all value forms (quoted string escapes, HTAB, LF normalization), see [Lexical Structure](./lexical-structure.md).

## Value Forms

SDIF defines three scalar value forms. The parser selects the form based on the characters immediately following the key.

| Form | Example | When to use |
|---|---|---|
| Unquoted | `status in-progress` | Single-token values with no spaces or `#` |
| Quoted | `title "Refactor auth module"` | Values containing spaces, leading/trailing whitespace, or `#` |
| Triple-quoted | `notes """` … `"""` | Multi-line narrative text |

### Unquoted Values

An **unquoted value** begins on the same line as the key, separated by one or more space characters (U+0020). It extends to the end of the line, excluding any trailing inline comment.

- An unquoted value MUST NOT contain a literal space character, because the parser treats the first space-delimited boundary as the end of the value.
- An unquoted value MUST NOT start with `"`, which would make the parser treat it as a quoted string.
- An unquoted value MUST NOT contain `#` (which would start a comment).
- Implementations MUST NOT strip or modify the characters of an unquoted value during parsing.

Example:

```
id        task-42
status    in-progress
due       2026-06-01
priority  high
```

### Quoted Values

A **quoted value** is enclosed in double-quote characters (`"`, U+0022) on the same line as the key.

- A quoted string begins with `"` and ends with the next unescaped `"` on the same line.
- Parsers MUST report `SDIF_STRING_UNCLOSED` if EOF or LF is reached before the closing `"`. A quoted scalar MUST be terminated on the same logical line as it opens.
- No non-whitespace, non-comment content MAY appear on the same line after the closing `"`. Parsers MUST report `SDIF_STRING_TRAILING` if trailing content is detected after the closing quote.
- The following escape sequences are recognized inside quoted strings:

  | Sequence | Meaning |
  |---|---|
  | `\\` | Literal backslash |
  | `\"` | Literal double-quote |
  | `\n` | Line feed (U+000A) |
  | `\t` | Horizontal tab (U+0009) |
  | `\r` | Carriage return (U+000D) |
  | `\uXXXX` | Unicode code point (four hex digits) |
  | `\UXXXXXXXX` | Unicode code point (eight hex digits) |

- Parsers MUST report an error for any unrecognized escape sequence.
- Quoted values SHOULD be used whenever a value contains spaces, a `#`, or characters that would otherwise be parsed as comment or structural tokens.

Example:

```
title     "Refactor authentication module"
author    "Alice O'Brien"
summary   "Depends on task #39 completing first"
```

### Triple-Quoted Values

A **triple-quoted value** (narrative block) is used for multi-line text. It begins with `"""` on the same line as the key or on the following line, and ends with `"""` on its own line.

- The opening `"""` MUST appear either immediately following `identifier SP` on the key line, or on the line immediately following the key line. No other tokens MAY follow `"""` on the opening delimiter line.
- The closing `"""` MUST appear alone on a line (optionally preceded by the same indentation prefix as the block's content).
- Content between the delimiters is treated as verbatim UTF-8 text. SDIF escape sequences are NOT processed inside triple-quoted blocks.
- Leading indentation that is consistent across all content lines SHOULD be stripped by the parser (normalized indentation).
- Comments MUST NOT appear inside triple-quoted blocks; a `#` inside a narrative block is treated as a literal character.
- Triple-quoted blocks MUST be used in preference to embedded `\n` escapes when the value spans more than one line.

Example:

```
notes """
This task addresses the memory leak reported in issue #204.
All affected subsystems must be audited before the fix is merged.
"""
```

## The `null` Literal

The special token `null` represents an absent or empty value.

- `null` MAY appear as a scalar field value, a table cell value, or a schema default.
- Parsers MUST treat the literal token `null` (case-sensitive) as distinct from the string `"null"`.
- `null` as a scalar field value signals that the field is explicitly present but carries no value. This is distinct from the field being absent from the document entirely.
- The tokens `true` and `false` have no special meaning in SDIF 1.0. They are ordinary string values and MUST be treated as unquoted tokens.

Example:

```
assignee  null
```

## Grammar Summary

```
scalar-field    = identifier SP scalar-value NEWLINE
scalar-value    = unquoted-token | quoted-string | triple-quoted-string

unquoted-token       = <UTF-8 chars, excluding SP, HTAB, LF, "#">+
quoted-string        = '"' (char | escape-seq)* '"'
escape-seq           = '\\' | '\"' | '\n' | '\t' | '\r' | '\uXXXX' | '\UXXXXXXXX'
triple-quoted-string = '"""' NEWLINE verbatim-content '"""' NEWLINE
verbatim-content     = <any UTF-8 lines until closing '"""'>
```

See [Lexical Structure](./lexical-structure.md) for the complete character-level rules, including identifier grammar, line-ending normalization, and canonical stripping of comments and blank lines.
