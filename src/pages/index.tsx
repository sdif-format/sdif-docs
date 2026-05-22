import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import styles from './index.module.css';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const FEATURES = [
  {
    title: 'Compact tables',
    body: 'Define columns once, rows are tab-delimited values. No repeated keys.',
  },
  {
    title: 'Semantic relations',
    body: 'First-class triples: subject predicate object.',
  },
  {
    title: 'Declarative schemas',
    body: 'Field types, required constraints, table shapes.',
  },
  {
    title: 'Canonical form',
    body: 'Deterministic byte output from any valid source.',
  },
  {
    title: 'Deterministic hashes',
    body: 'SHA-256 over canonical bytes for signing and cache keys.',
  },
  {
    title: 'AI projections',
    body: 'Token-optimized .sdif.ai views with full round-trip fidelity.',
  },
  {
    title: 'Round-trip conversion',
    body: 'JSON ↔ SDIF with semantic preservation.',
  },
  {
    title: 'Reproducible benchmarks',
    body: 'Public methodology, corpus, and results.',
  },
];

const ECOSYSTEM = [
  {
    name: 'sdif',
    desc: 'Reference implementation: parser, CLI, canonicalization, validation, JSON conversion.',
    href: 'https://github.com/sdif-format/sdif',
  },
  {
    name: 'sdif-benchmarks',
    desc: 'Reproducible benchmark suite with public reports.',
    href: 'https://github.com/sdif-format/sdif-benchmarks',
  },
  {
    name: 'tree-sitter-sdif',
    desc: 'Grammar and editor tooling for SDIF syntax.',
    href: 'https://github.com/sdif-format/tree-sitter-sdif',
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function HeroSection(): React.JSX.Element {
  const wordmarkSrc = useBaseUrl('/img/sdif-logo-t.png');

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <img
          className={styles.heroWordmark}
          src={wordmarkSrc}
          alt="SDIF"
          width={420}
          height={164}
        />
        <h1 className={styles.heroTitle}>
          SDIF &mdash; Semantic Data Interchange Format
        </h1>
        <p className={styles.heroSubtitle}>
          Compact, semantic, canonicalizable data for AI agents
          <br />
          and deterministic machine workflows.
        </p>
        <div className={styles.heroButtons}>
          <Link
            className={`button button--primary button--lg ${styles.heroBtn}`}
            to="/docs/getting-started"
          >
            Get started
          </Link>
          <Link
            className={`button button--secondary button--lg ${styles.heroBtn}`}
            to="/docs/spec/"
          >
            Read the spec
          </Link>
          <Link
            className={`button button--secondary button--lg ${styles.heroBtn}`}
            to="/docs/benchmarks/"
          >
            See benchmarks
          </Link>
          <a
            className={`button button--outline button--lg ${styles.heroBtn}`}
            href="https://github.com/sdif-format/sdif"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

const JSON_EXAMPLE = `[
  { "id": "R1", "status": "done", "gate": "verify" },
  { "id": "R2", "status": "open", "gate": "release" }
]`;

// Tab characters are required in SDIF table rows (per SDIF spec).
const SDIF_EXAMPLE = `@sdif 1.0
kind Plan

milestones[id,status,gate]:
\tR1\tdone\tverify
\tR2\topen\trelease`;

function ComparisonSection(): React.JSX.Element {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Why SDIF?</h2>
        <div className={styles.comparison}>
          <div className={styles.comparisonPane}>
            <div className={styles.comparisonLabel}>JSON</div>
            <pre className={styles.codeBlock}>
              <code className="language-json">{JSON_EXAMPLE}</code>
            </pre>
          </div>
          <div className={styles.comparisonPane}>
            <div className={styles.comparisonLabel}>SDIF</div>
            <pre className={styles.codeBlock}>
              <code>{SDIF_EXAMPLE}</code>
            </pre>
          </div>
        </div>
        <p className={styles.comparisonCaption}>
          SDIF table headers defined once. Rows are tab-separated values. No key repetition.
        </p>
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  body,
}: {
  title: string;
  body: string;
}): React.JSX.Element {
  return (
    <div className={styles.featureCard}>
      <h3 className={styles.featureCardTitle}>{title}</h3>
      <p className={styles.featureCardBody}>{body}</p>
    </div>
  );
}

function FeaturesSection(): React.JSX.Element {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>What SDIF gives you</h2>
        <div className={styles.featureGrid}>
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} title={f.title} body={f.body} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EcosystemCard({
  name,
  desc,
  href,
}: {
  name: string;
  desc: string;
  href: string;
}): React.JSX.Element {
  return (
    <a
      className={styles.ecosystemCard}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <h3 className={styles.ecosystemCardName}>{name}</h3>
      <p className={styles.ecosystemCardDesc}>{desc}</p>
    </a>
  );
}

function EcosystemSection(): React.JSX.Element {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>The SDIF ecosystem</h2>
        <div className={styles.ecosystemGrid}>
          {ECOSYSTEM.map((e) => (
            <EcosystemCard key={e.name} name={e.name} desc={e.desc} href={e.href} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LlmSection(): React.JSX.Element {
  const llmsTxt = useBaseUrl('/llms.txt');
  const llmsFullTxt = useBaseUrl('/llms-full.txt');

  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>For agents and LLMs</h2>
        <div className={styles.llmBlock}>
          <p>
            Read{' '}
            <a href={llmsTxt} target="_blank" rel="noopener noreferrer">
              /llms.txt
            </a>{' '}
            for a compact project overview.
          </p>
          <p>
            Read{' '}
            <a href={llmsFullTxt} target="_blank" rel="noopener noreferrer">
              /llms-full.txt
            </a>{' '}
            for the complete documentation bundle.
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Compact, semantic, canonicalizable data for AI agents and deterministic machine workflows."
    >
      <HeroSection />
      <main>
        <ComparisonSection />
        <FeaturesSection />
        <EcosystemSection />
        <LlmSection />
      </main>
    </Layout>
  );
}
