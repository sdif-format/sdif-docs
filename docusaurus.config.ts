import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'SDIF',
  tagline: 'Compact, semantic, canonicalizable data for AI agents and deterministic machine workflows.',
  favicon: 'img/sdif-symbol-logo.png',
  url: 'https://sdif-format.github.io',
  baseUrl: '/sdif-docs/',
  organizationName: 'sdif-format',
  projectName: 'sdif-docs',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/sdif-format/sdif-docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: 'img/social-card.png',
    navbar: {
      title: 'SDIF',
      logo: {
        alt: 'SDIF Logo',
        src: 'img/sdif-logo-t.png',
      },
      items: [
        {to: '/docs/why-sdif', label: 'Why SDIF?', position: 'left'},
        {type: 'docSidebar', sidebarId: 'docs', label: 'Docs', position: 'left'},
        {to: '/docs/spec/', label: 'Spec', position: 'left'},
        {to: '/docs/benchmarks/', label: 'Benchmarks', position: 'left'},
        {to: '/docs/examples/plan', label: 'Examples', position: 'left'},
        {to: '/docs/ecosystem/', label: 'Ecosystem', position: 'left'},
        {
          href: 'https://github.com/sdif-format/sdif',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Getting Started', to: '/docs/getting-started'},
            {label: 'Concepts', to: '/docs/concepts/overview'},
            {label: 'Guides', to: '/docs/guides/install'},
          ],
        },
        {
          title: 'Reference',
          items: [
            {label: 'Specification', to: '/docs/spec/'},
            {label: 'Benchmarks', to: '/docs/benchmarks/'},
            {label: 'Examples', to: '/docs/examples/plan'},
          ],
        },
        {
          title: 'Ecosystem',
          items: [
            {label: 'Ecosystem', to: '/docs/ecosystem/'},
            {label: 'GitHub', href: 'https://github.com/sdif-format/sdif'},
            {label: 'sdif-benchmarks', href: 'https://github.com/sdif-format/sdif-benchmarks'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} SDIF Authors. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
