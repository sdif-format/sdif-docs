---
title: "Reproduce"
sidebar_position: 9
---

# Reproduce

The benchmark suite is available in the [sdif-benchmarks](https://github.com/sdif-format/sdif-benchmarks) repository. You can run it against the default corpus or your own documents.

## Run the Default Suite

```bash
git clone https://github.com/sdif-format/sdif-benchmarks.git
cd sdif-benchmarks
python -m venv .venv
source .venv/bin/activate
pip install -e .
python benchmarks/run.py
```

Results are written to the `output/` directory as `summary.md`, `summary.json`, `summary.sdif`, and `summary.sdif.ai`.

## Use Your Own Corpus

Place your `.sdif` documents in the `corpus/` directory before running. The benchmark script reads all `.sdif` files it finds there and converts each to every target format before measuring.

```bash
cp your-documents/*.sdif corpus/
python benchmarks/run.py
```

## Notes

- The benchmark runner requires Python 3.9 or later.
- Token count measurement requires the `tiktoken` package, which is installed as part of `pip install -e .`.
- TOON format comparison requires the optional `toon` package. If it is not installed, TOON columns are omitted from results rather than causing an error.
- Results reflect the tokenizer and corpus in use at the time of the run. Compare runs only when both are held constant.
