import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import siteConfig from '@generated/docusaurus.config';

// SDIF grammar for Prism syntax highlighting
function registerSdif(Prism) {
  Prism.languages.sdif = {
    'comment': {
      pattern: /#.*/,
      greedy: true,
    },
    'directive': {
      pattern: /^@[a-z][a-z0-9]*/m,
      alias: 'keyword',
    },
    'table-def': {
      pattern: /^[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)?\[(?:[a-zA-Z_][a-zA-Z0-9_?]*,?)*\]\s*:/m,
      alias: 'function',
      inside: {
        'table-name': {
          pattern: /^[a-zA-Z_][a-zA-Z0-9_.]+/,
          alias: 'class-name',
        },
        'columns': {
          pattern: /\[[^\]]*\]/,
          inside: {
            'punctuation': /[\[\],]/,
            'optional': {
              pattern: /[a-zA-Z_][a-zA-Z0-9_]*\?/,
              alias: 'attr-name',
            },
            'column': {
              pattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
              alias: 'attr-name',
            },
          },
        },
        'punctuation': /[.:]/,
      },
    },
    'relation': {
      pattern: /^~\s+\S+\s+\S+\s+\S+/m,
      alias: 'string',
      inside: {
        'punctuation': /^~/,
      },
    },
    'kind-decl': {
      pattern: /^(?:kind|schema|version)\s+\S+/m,
      inside: {
        'keyword': /^(?:kind|schema|version)/,
        'class-name': /\S+$/,
      },
    },
    'field-decl': {
      pattern: /^[a-zA-Z_][a-zA-Z0-9_]*(?:\?\s*|\s+)\S.*/m,
      inside: {
        'attr-name': /^[a-zA-Z_][a-zA-Z0-9_]*/,
        'punctuation': /[?:]/,
        'type': {
          pattern: /\b(?:str|int|float|bool|date|datetime|uuid|ref)\b/,
          alias: 'builtin',
        },
        'string': /"[^"]*"/,
        'number': /\b\d+\.?\d*\b/,
        'boolean': /\b(?:true|false|null)\b/,
      },
    },
    'string': {
      pattern: /"(?:[^"\\]|\\.)*"/,
      greedy: true,
    },
    'number': /\b\d+\.?\d*(?:[eE][+-]?\d+)?\b/,
    'boolean': /\b(?:true|false|null)\b/,
    'punctuation': /[[\]():,]/,
    'version': {
      pattern: /\b\d+\.\d+\b/,
      alias: 'number',
    },
  };

  Prism.languages.sdif_ai = Prism.languages.sdif;
}

const prismIncludeLanguages = (PrismObject) => {
  if (ExecutionEnvironment.canUseDOM) {
    const {
      themeConfig: {prism = {}},
    } = siteConfig;
    const {additionalLanguages = []} = prism;

    globalThis.Prism = PrismObject;

    registerSdif(PrismObject);

    additionalLanguages.forEach((lang) => {
      // eslint-disable-next-line global-require
      require(`prismjs/components/prism-${lang}`);
    });

    delete globalThis.Prism;
  }
};

export default prismIncludeLanguages;
