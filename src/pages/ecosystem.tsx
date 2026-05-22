import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function EcosystemPage(): React.ReactElement {
  return (
    <Layout
      title="Ecosystem"
      description="The SDIF ecosystem: official repositories, tooling, and roadmap."
    >
      <main style={{maxWidth: 800, margin: '0 auto', padding: '2rem 1rem'}}>
        <h1>Ecosystem</h1>
        <p>
          The SDIF ecosystem consists of official repositories maintained under the{' '}
          <a href="https://github.com/sdif-format">sdif-format</a> GitHub organization.
        </p>
        <p>
          <Link className="button button--primary button--lg" to="/docs/ecosystem/">
            Read ecosystem documentation
          </Link>
        </p>
        <h2>Repositories</h2>
        <ul>
          <li>
            <Link to="/docs/ecosystem/sdif-core"><strong>sdif</strong></Link> — Reference Python implementation: parser, CLI, canonicalizer, JSON conversion, AI projection
          </li>
          <li>
            <Link to="/docs/ecosystem/sdif-benchmarks"><strong>sdif-benchmarks</strong></Link> — Reproducible benchmark suite
          </li>
          <li>
            <Link to="/docs/ecosystem/tree-sitter-sdif"><strong>tree-sitter-sdif</strong></Link> — Tree-sitter grammar for syntax highlighting
          </li>
          <li>
            <Link to="/docs/ecosystem/editor-support"><strong>Editor Support</strong></Link> — VS Code and other editor integrations
          </li>
        </ul>
        <h2>Roadmap</h2>
        <p>
          <Link to="/docs/ecosystem/roadmap">See the roadmap</Link> for planned work, in-progress items, and what is explicitly out of scope for v1.
        </p>
      </main>
    </Layout>
  );
}
