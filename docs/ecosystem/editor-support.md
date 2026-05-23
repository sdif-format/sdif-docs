---
title: "Editor Support"
sidebar_position: 5
---

# Editor Support

SDIF editor support is currently provided through the Tree-sitter grammar in the [`tree-sitter-sdif`](https://github.com/sdif-format/tree-sitter-sdif) repository. Any editor with Tree-sitter support can use this grammar for syntax highlighting.

## File Extensions

SDIF uses three file extensions:

- `.sdif` — standard source documents.
- `.sdif.canon` — canonical form output.
- `.sdif.ai` — AI projection files.

You may need to configure your editor to associate these extensions with the SDIF language mode.

## Editors with Confirmed Tree-sitter Support

The following editors have built-in or well-established Tree-sitter integration:

### Neovim

Neovim supports Tree-sitter through the `nvim-treesitter` plugin. You can add `tree-sitter-sdif` as a custom parser. Refer to the `nvim-treesitter` documentation for instructions on registering a custom grammar from an external repository.

### Helix

Helix has Tree-sitter support built into the editor. Adding a custom language requires creating a `languages.toml` entry that points to the grammar repository. Refer to the Helix documentation on adding languages.

### Zed

Zed uses Tree-sitter as its primary parsing layer. Extension authors can bundle Tree-sitter grammars. Check the Zed extensions registry or the `tree-sitter-sdif` repository for current status.

## Other Editors

Editors like VS Code, Emacs, and others may support SDIF syntax highlighting through Tree-sitter-based extensions or language server integrations. These are not confirmed at this time. If you build or find an integration for another editor, contributions to the `tree-sitter-sdif` repository are welcome.

## See Also

- [tree-sitter-sdif](./tree-sitter-sdif) — grammar repository details and installation notes.
