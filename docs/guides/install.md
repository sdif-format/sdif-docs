---
title: "Install"
sidebar_position: 1
---

# Install

## Requirements

- Python 3.9 or later
- pip (bundled with Python 3.9+)

## Install from PyPI

```bash
pip install sdif-format
```

This installs the `sdif` CLI and the `sdif` Python library. The PyPI package is named `sdif-format` to avoid a name collision with an unrelated package; the CLI command and import name remain `sdif`.

## Editable install from source

To work from the repository directly (for development or to test unreleased changes):

```bash
git clone https://github.com/sdif-format/sdif
cd sdif
pip install -e .
```

The `-e` flag installs in editable mode: changes to the source files in `src/` are reflected immediately without reinstalling.

## Verify the CLI

```bash
sdif --help
```

You should see output listing available subcommands (`parse`, `canon`, `hash`, `tokens`, `to-json`, `from-json`, `ai`, `from-ai`, `validate`, `inspect`, `fmt`).

If `sdif` is not found after installation, your Python environment's `bin` directory may not be on your `PATH`. Common fixes:

```bash
# Check where pip installs scripts
python -m pip show -f sdif-format | grep Location

# Add user bin to PATH (if using --user install)
export PATH="$HOME/.local/bin:$PATH"
```
