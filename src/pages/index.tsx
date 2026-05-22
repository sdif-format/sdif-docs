import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import styles from './index.module.css';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const FLAGS = [
  { flag: '--compact-tables',        desc: 'Define columns once. Rows are tab-delimited values — no repeated keys.' },
  { flag: '--semantic-relations',    desc: 'First-class triple syntax: subject predicate object.' },
  { flag: '--declarative-schemas',   desc: 'Field types, required constraints, and table shapes in plain SDIF.' },
  { flag: '--canonical-form',        desc: 'Deterministic UTF-8 byte output from any valid source document.' },
  { flag: '--deterministic-hash',    desc: 'SHA-256 over canonical bytes — stable cache keys, signing, comparisons.' },
  { flag: '--ai-projections',        desc: 'Token-optimized .sdif.ai with full round-trip fidelity to canonical SDIF.' },
  { flag: '--json-roundtrip',        desc: 'JSON ↔ SDIF conversion with semantic preservation.' },
  { flag: '--reproducible-bench',    desc: 'Public corpus, methodology, and benchmark results in sdif-benchmarks.' },
];

const REPOS = [
  {
    name: 'sdif',
    badge: 'stable',
    desc: 'Reference Python implementation: parser, CLI, canonicalizer, schema validator, JSON conversion, AI projection.',
    href: 'https://github.com/sdif-format/sdif',
  },
  {
    name: 'sdif-benchmarks',
    badge: 'available',
    desc: 'Reproducible benchmark suite — token efficiency, semantic density, round-trip fidelity across JSON/YAML/XML/TOON.',
    href: 'https://github.com/sdif-format/sdif-benchmarks',
  },
  {
    name: 'tree-sitter-sdif',
    badge: 'available',
    desc: 'Tree-sitter grammar for SDIF. Enables syntax highlighting in any editor with Tree-sitter support.',
    href: 'https://github.com/sdif-format/tree-sitter-sdif',
  },
];

// ---------------------------------------------------------------------------
// Terminal window component
// ---------------------------------------------------------------------------

interface TerminalWindowProps {
  filename: string;
  children: React.ReactNode;
}

function TerminalWindow({ filename, children }: TerminalWindowProps): React.JSX.Element {
  return (
    <div className={styles.terminalWindow}>
      <div className={styles.terminalHeader}>
        <span className={styles.terminalDot} />
        <span className={styles.terminalDot} />
        <span className={styles.terminalDot} />
        <span className={styles.terminalFilename}>{filename}</span>
      </div>
      <pre className={styles.terminalBody}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function HeroSection(): React.JSX.Element {
  const wordmarkSrc = useBaseUrl('/img/sdif-wordmark-dark.png');

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroLogoWrap}>
          <img
            className={styles.heroWordmark}
            src={wordmarkSrc}
            alt="SDIF"
            width={380}
            height={148}
          />
        </div>
        <p className={styles.heroTagline}>
          Compact, semantic, canonicalizable data for <em>AI agents</em>
          <br />
          and deterministic machine workflows.
          <span className={styles.cursor} aria-hidden="true" />
        </p>
        <div className={styles.heroButtons}>
          <Link className={styles.heroBtnPrimary} to="/docs/getting-started">
            get started
          </Link>
          <Link className={styles.heroBtnSecondary} to="/docs/spec/">
            read the spec
          </Link>
          <Link className={styles.heroBtnSecondary} to="/docs/benchmarks/">
            benchmarks
          </Link>
          <a
            className={styles.heroBtnGhost}
            href="https://github.com/sdif-format/sdif"
            target="_blank"
            rel="noopener noreferrer"
          >
            github ↗
          </a>
        </div>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 3v10M3 9l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Comparison (terminal windows)
// ---------------------------------------------------------------------------

function ComparisonSection(): React.JSX.Element {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.container}>
        <div className={styles.sectionLabel}>why sdif?</div>
        <h2 className={styles.sectionTitle}>Less noise. More structure.</h2>
        <p className={styles.sectionSub}>
          JSON repeats keys for every object in an array. SDIF declares columns once — rows are
          tab-separated values. Fewer tokens, same semantics, canonical form, stable hash.
        </p>

        <div className={styles.terminalGrid}>
          <TerminalWindow filename="plan.json">
            <span className={styles.jsonPunct}>{'['}</span>{'\n'}
            {'  '}<span className={styles.jsonPunct}>{'{'}</span> <span className={styles.jsonKey}>"id"</span><span className={styles.jsonPunct}>:</span> <span className={styles.jsonString}>"R1"</span><span className={styles.jsonPunct}>,</span> <span className={styles.jsonKey}>"status"</span><span className={styles.jsonPunct}>:</span> <span className={styles.jsonString}>"done"</span><span className={styles.jsonPunct}>,</span> <span className={styles.jsonKey}>"gate"</span><span className={styles.jsonPunct}>:</span> <span className={styles.jsonString}>"verify"</span> <span className={styles.jsonPunct}>{'}'}</span><span className={styles.jsonPunct}>,</span>{'\n'}
            {'  '}<span className={styles.jsonPunct}>{'{'}</span> <span className={styles.jsonKey}>"id"</span><span className={styles.jsonPunct}>:</span> <span className={styles.jsonString}>"R2"</span><span className={styles.jsonPunct}>,</span> <span className={styles.jsonKey}>"status"</span><span className={styles.jsonPunct}>:</span> <span className={styles.jsonString}>"open"</span><span className={styles.jsonPunct}>,</span> <span className={styles.jsonKey}>"gate"</span><span className={styles.jsonPunct}>:</span> <span className={styles.jsonString}>"release"</span> <span className={styles.jsonPunct}>{'}'}</span>{'\n'}
            <span className={styles.jsonPunct}>{']'}</span>
          </TerminalWindow>

          <TerminalWindow filename="plan.sdif">
            <span className={styles.sdifDirective}>@sdif</span> <span className={styles.sdifValue}>1.0</span>{'\n'}
            <span className={styles.sdifKind}>kind</span> <span className={styles.sdifValue}>Plan</span>{'\n'}
            {'\n'}
            <span className={styles.sdifTable}>milestones</span><span className={styles.jsonPunct}>[id,status,gate]</span><span className={styles.jsonPunct}>:</span>{'\n'}
            {'  '}<span className={styles.sdifValue}>R1</span>{'\t'}<span className={styles.sdifValue}>done</span>{'\t'}<span className={styles.sdifValue}>verify</span>{'\n'}
            {'  '}<span className={styles.sdifValue}>R2</span>{'\t'}<span className={styles.sdifValue}>open</span>{'\t'}<span className={styles.sdifValue}>release</span>
          </TerminalWindow>
        </div>

        <p className={styles.comparisonCaption}>
          Column headers defined once · Rows tab-delimited · Hash-stable canonical form
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Features (CLI flags layout)
// ---------------------------------------------------------------------------

function FeaturesSection(): React.JSX.Element {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionLabel}>features</div>
        <h2 className={styles.sectionTitle}>What SDIF gives you</h2>

        <div className={styles.flagsTable}>
          {FLAGS.map(({ flag, desc }) => (
            <div key={flag} className={styles.flagRow}>
              <span className={styles.flagName}>{flag}</span>
              <span className={styles.flagDesc}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Ecosystem
// ---------------------------------------------------------------------------

function EcosystemSection(): React.JSX.Element {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.container}>
        <div className={styles.sectionLabel}>ecosystem</div>
        <h2 className={styles.sectionTitle}>Official repositories</h2>
        <p className={styles.sectionSub}>
          Maintained under the{' '}
          <a href="https://github.com/sdif-format" target="_blank" rel="noopener noreferrer">
            sdif-format
          </a>{' '}
          GitHub organization.
        </p>

        <div className={styles.ecosystemGrid}>
          {REPOS.map(({ name, badge, desc, href }) => (
            <a
              key={name}
              className={styles.ecosystemCard}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.ecosystemName}>
                {name}
                <span className={styles.ecosystemBadge}>{badge}</span>
              </div>
              <p className={styles.ecosystemDesc}>{desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// LLM / Agent docs
// ---------------------------------------------------------------------------

function LlmSection(): React.JSX.Element {
  const llmsTxt = useBaseUrl('/llms.txt');
  const llmsFullTxt = useBaseUrl('/llms-full.txt');

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionLabel}>for agents &amp; llms</div>
        <h2 className={styles.sectionTitle}>Machine-readable docs</h2>
        <p className={styles.sectionSub}>
          SDIF ships compact, agent-ready documentation alongside the human docs.
        </p>

        <div className={styles.llmPanel}>
          <div className={styles.llmEntry}>
            <a className={styles.llmPath} href={llmsTxt} target="_blank" rel="noopener noreferrer">
              /llms.txt
            </a>
            <span className={styles.llmPathDesc}>
              Compact project overview — format version, purpose, CLI commands, rules for assistants.
            </span>
          </div>
          <div className={styles.llmEntry}>
            <a className={styles.llmPath} href={llmsFullTxt} target="_blank" rel="noopener noreferrer">
              /llms-full.txt
            </a>
            <span className={styles.llmPathDesc}>
              Complete documentation bundle — syntax, canonicalization, examples, spec links, limitations.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page root
// ---------------------------------------------------------------------------

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}
    >
      <HeroSection />
      <ComparisonSection />
      <FeaturesSection />
      <EcosystemSection />
      <LlmSection />
    </Layout>
  );
}
