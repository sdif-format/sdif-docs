# sdif-docs

Documentation website for [SDIF (Semantic Data Interchange Format)](https://github.com/sdif-format/sdif).

Built with [Docusaurus 3](https://docusaurus.io/). Deployed to [sdif-format.github.io/sdif-docs](https://sdif-format.github.io/sdif-docs/).

## Development

```bash
npm install
npm start        # dev server at http://localhost:3000/sdif-docs/
npm run build    # production build in build/
npm run serve    # preview production build
```

## Structure

```
docs/           Documentation pages (sidebar-driven)
src/pages/      Standalone pages (home, benchmarks, ecosystem)
static/         Static assets (llms.txt, llms-full.txt, images)
sidebars.ts     Sidebar configuration
docusaurus.config.ts  Site configuration
```

## Deploy

Pushed to `main` triggers the GitHub Actions workflow that builds and deploys to GitHub Pages.

## License

See the [sdif](https://github.com/sdif-format/sdif) repository for license information.
