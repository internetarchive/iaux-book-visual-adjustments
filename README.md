[![Build Status](https://travis-ci.com/internetarchive/iaux-book-visual-adjustments.svg?branch=master)](https://travis-ci.com/internetarchive/iaux-book-visual-adjustments)
[![codecov](https://codecov.io/gh/internetarchive/iaux-book-visual-adjustments/branch/master/graph/badge.svg)](https://codecov.io/gh/internetarchive/iaux-book-visual-adjustments)

# \<ia-book-visual-adjustments>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation
```bash
npm i ia-book-visual-adjustments
```
or
```bash
yarn add @internetarchive/ia-book-visual-adjustments
```

## Usage
```html
<script type="module">
  import 'ia-book-visual-adjustments/ia-book-visual-adjustments.js';
</script>

<ia-book-visual-adjustments></ia-book-visual-adjustments>
```

The only property is an array of options. Each option has these properties:

```
{
  id: 'contrast', // Identifier for adjustment type
  name: 'Use increased contrast', // Name of adjustment rendered as label text
  description: 'Pages will display as high-contrast black and white images.', // More info on adjustment
  active: false, // Checked state of option
}
```

## Linting with ESLint
To scan the project for linting errors, run
```bash
npm run lint
```

## Testing with Karma
To run the suite of karma tests, run
```bash
npm run test
```

To run the tests in watch mode (for <abbr title="test driven development">TDD</abbr>, for example), run

```bash
npm run test:watch
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `es-dev-server`
```bash
npm start
```
To run a local development server that serves the basic demo located in `demo/index.html`
