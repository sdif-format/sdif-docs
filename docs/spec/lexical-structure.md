---
title: "Lexical Structure"
sidebar_position: 2
---

# Lexical Structure

This page defines the low-level character-level rules for SDIF documents.

## Encoding

SDIF documents MUST be encoded in **UTF-8**. Implementations MUST reject documents that contain invalid UTF-8 byte sequences. The UTF-8 byte order mark (BOM, U+FEFF) at the start of a document SHOULD be tolerated by parsers but MUST NOT be emitted in canonical form.

## Line Endings

SDIF uses **LF (U+000A)** as the canonical line terminator.

- Implementations MUST normalize **CRLF (U+000D U+000A)** to LF on parse.
- Implementations MUST NOT emit CRLF in canonical form.
- A lone CR (U+000D) without a following LF is not a valid line ending and parsers MUST report a lexical error when encountered.

## Whitespace and Indentation

Leading whitespace is significant in SDIF for indicating block structure.

- **Child blocks** (table rows, relation triples, rule expressions, and narrative content) MUST use **two-space indentation** (`  `, two U+0020 characters) in canonical form.
- Implementations MAY accept other indentation in source form and MUST normalize to two-space indentation in canonical output.
- Trailing whitespace on any line MUST be stripped in canonical form.

## Column Separator: HTAB

Within table rows, SDIF uses the **horizontal tab character (HTAB, U+0009)** as the column separator.

- Implementations MUST use a literal HTAB character between column values in table rows. Spaces MUST NOT be used as column separators.
- Parsers MUST NOT treat runs of spaces as equivalent to a tab in table row context.
- Canonical output MUST preserve tab-delimited structure for all table rows.

## Comments

SDIF supports single-line comments introduced by the `#` character.

- A `#` character that appears outside a quoted string or triple-quoted narrative starts a comment that extends to the end of the line (up to but not including the LF).
- Comments MUST be stripped in canonical form. Parsers MUST preserve comment content in the AST as trivia nodes (for tooling that needs to round-trip comments).
- Comments MUST NOT appear within triple-quoted narrative blocks.

Example:

```
# This is a comment
kind Plan  # inline comment
```

## Blank Lines

Blank lines (lines containing only optional whitespace before LF) are permitted in source form as visual separators.

- Blank lines and blank-line trivia MUST be removed in canonical form.

## Identifiers

Identifiers are used for kind names, field keys, table names, column names, schema member names, and predicate names.

An identifier MUST match the following pattern:

```
identifier = [a-zA-Z_] [a-zA-Z0-9_\-\.]*
```

That is, an identifier:

- MUST begin with a letter (A–Z, a–z) or underscore (`_`).
- MAY contain letters, digits (0–9), underscores (`_`), hyphens (`-`), and dots (`.`).
- MUST NOT contain spaces or other punctuation.

## Quoted Strings

Scalar string values MAY be enclosed in double quotes (`"`).

- A quoted string begins with `"` and ends with the next unescaped `"` on the same line.
- The following escape sequences are recognized within quoted strings:

  | Sequence | Meaning |
  |---|---|
  | `\\` | Literal backslash |
  | `\"` | Literal double quote |
  | `\n` | Line feed (U+000A) |
  | `\t` | Horizontal tab (U+0009) |
  | `\r` | Carriage return (U+000D) |
  | `\uXXXX` | Unicode code point (four hex digits) |
  | `\UXXXXXXXX` | Unicode code point (eight hex digits) |

- Multi-line content MUST use triple-quoted narrative blocks rather than embedded `\n` escapes in field values, unless the value is short and the context is a single-line field.
- Parsers MUST report an error for an unterminated quoted string (EOF or LF reached before closing `"`).

## Triple-Quoted Narratives

Narrative content is enclosed in triple double-quotes (`"""`).

- A narrative block begins with `"""` on its own line (or following a field key) and ends with `"""` on its own line.
- Content between the delimiters is treated as verbatim UTF-8 text.
- Leading indentation that is consistent across all lines of the block SHOULD be stripped by the parser (normalized indentation).
- Triple-quoted blocks MUST NOT contain comments or SDIF directives.

## Directives

Directives are lines that begin with `@` and appear before or at the top of a document.

- Directive syntax: `@name value`
- The `@sdif` directive MUST appear as the first non-blank, non-comment line of a document.
- Directive names are case-sensitive.
- Parsers MUST ignore unrecognized directives with a warning (forward-compatibility); they MUST NOT silently discard recognized directives with unexpected values.

Recognized directives include:

| Directive | Example | Purpose |
|---|---|---|
| `@sdif` | `@sdif 1.0` | Format version header (required) |
| `@profile` | `@profile canonical` | Declares source, canonical, or AI profile |
| `@sdif.ai` | `@sdif.ai 1.0` | AI profile version header |
