import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function BenchmarksPage(): React.ReactElement {
  return (
    <Layout
      title="Benchmarks"
      description="SDIF benchmark results: token efficiency, semantic density, and round-trip fidelity compared to JSON, YAML, XML, and TOON."
    >
      <main style={{maxWidth: 800, margin: '0 auto', padding: '2rem 1rem'}}>
        <h1>Benchmarks</h1>
        <p>
          SDIF and SDIF AI are compared against JSON Compact, JSON Pretty, YAML, XML, and TOON
          across three dimensions: token efficiency, semantic density, and round-trip fidelity.
        </p>
        <p>
          <Link className="button button--primary button--lg" to="/docs/benchmarks/">
            Read benchmark documentation
          </Link>
        </p>
        <h2>Sections</h2>
        <ul>
          <li><Link to="/docs/benchmarks/methodology">Methodology</Link> — corpus, metrics, and serialization rules</li>
          <li><Link to="/docs/benchmarks/token-efficiency">Token Efficiency</Link> — SDIF vs JSON, YAML, XML, TOON</li>
          <li><Link to="/docs/benchmarks/semantic-density">Semantic Density</Link> — tokens per semantic fact</li>
          <li><Link to="/docs/benchmarks/roundtrip-fidelity">Round-trip Fidelity</Link> — conversion cycle preservation</li>
          <li><Link to="/docs/benchmarks/sdif-vs-json">SDIF vs JSON</Link></li>
          <li><Link to="/docs/benchmarks/sdif-vs-yaml">SDIF vs YAML</Link></li>
          <li><Link to="/docs/benchmarks/sdif-vs-toon">SDIF vs TOON</Link></li>
          <li><Link to="/docs/benchmarks/reproduce">Reproduce</Link> — run the suite yourself</li>
        </ul>
      </main>
    </Layout>
  );
}
