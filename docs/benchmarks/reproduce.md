---
title: "Reproduce"
sidebar_position: 9
---

# Reproduce

The benchmark suite is available in the [sdif-benchmarks](https://github.com/sdif-format/sdif-benchmarks) repository. You can run it against the default corpus or your own documents.

## Run the Default Suite

```bash
git clone https://github.com/sdif-format/sdif.git
git clone https://github.com/sdif-format/sdif-benchmarks.git
cd sdif-benchmarks
python -m venv .venv
source .venv/bin/activate
pip install -e .
SDIF_CORE_REPO=../sdif python3 scripts/run_suite.py
```

By default, the benchmark repo expects the core SDIF repo at `../sdif`; set `SDIF_CORE_REPO` if it lives elsewhere. Results are written to `results/<track>/` plus a unified suite index at `results/index.json`, `results/index.sdif`, `results/index.sdif.ai`, `results/README.md`, and `results/dashboard.html`.

## Use Your Own Corpus

Point the suite at a golden-fixture directory with the same shape used by the core repo: `examples/golden/<name>/equivalent.json` plus `source.sdif` and, where applicable, canonical evidence files.

```bash
SDIF_BENCHMARK_GOLDEN_DIR=/path/to/examples/golden \
SDIF_CORE_REPO=../sdif \
python3 scripts/run_suite.py
```

## Notes

- The benchmark runner requires Python 3.10 or later.
- Token count measurement requires the tokenizer packages installed with the benchmark repo; optional tokenizer integrations can be disabled with environment variables.
- TOON format comparison is optional; set `SDIF_BENCHMARK_TOON=0` to disable it.
- Retrieval accuracy is opt-in: set `SDIF_BENCHMARK_RETRIEVAL=1` and provide the required model API key.
- You can run individual tracks with `--only token`, `--only context`, `--only roundtrip`, `--only delta`, `--only semantic`, `--only ops`, or `--only retrieval`.
- Results reflect the tokenizer and corpus in use at the time of the run. Compare runs only when both are held constant.
