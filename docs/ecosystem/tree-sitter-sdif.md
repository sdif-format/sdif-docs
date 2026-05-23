---
title: "tree-sitter-sdif"
sidebar_position: 4
---

# tree-sitter-sdif

The `tree-sitter-sdif` repository provides a [Tree-sitter](https://tree-sitter.github.io/) grammar for SDIF. It lives at [github.com/sdif-format/tree-sitter-sdif](https://github.com/sdif-format/tree-sitter-sdif).

## What Tree-sitter Is

Tree-sitter is a parser generator and incremental parsing library. It produces concrete syntax trees for source files and is designed to run fast enough for use in editors as you type. Many modern editors embed Tree-sitter to power syntax highlighting, code folding, and structural navigation without relying on regular-expression-based tokenizers.

## What tree-sitter-sdif Provides

The grammar teaches Tree-sitter how to parse SDIF documents. Once the grammar is installed in an editor, the editor gains:

- Syntax highlighting for SDIF source files (`.sdif`), canonical files (`.sdif.canon`), and AI projection files (`.sdif.ai`).
- Structural understanding of SDIF constructs: the `@sdif` header, table blocks with their column declarations and HTAB-separated rows, `rel:` relation blocks with subject-predicate-object triples, and narrative sections.

## Editors with Tree-sitter Support

Any editor that supports Tree-sitter grammars can use `tree-sitter-sdif`. Editors with built-in or well-supported Tree-sitter integration include:

- **Neovim** — supports Tree-sitter grammars through `nvim-treesitter`.
- **Helix** — has Tree-sitter support built in.
- **Zed** — uses Tree-sitter as its primary parsing layer.

Other editors may support Tree-sitter through plugins or extensions. Consult your editor's documentation for instructions on adding custom grammars.

## Installation

Installation steps vary by editor. In general, you point your editor's Tree-sitter integration at the grammar repository. For Neovim with `nvim-treesitter`, this typically involves adding `tree-sitter-sdif` as a custom parser entry. For Helix and Zed, follow the grammar configuration conventions documented by each editor.

Refer to the [tree-sitter-sdif README](https://github.com/sdif-format/tree-sitter-sdif) for up-to-date installation instructions and any editor-specific notes.
