# I18n Vite Plugin

This plugin converts your raw message JSON files into a new JSON object containing `cif` data and the `locale_id`.
It relies on the built-in `vite:json` plugin to finish the process of converting the JSON into an ESM module
(because I don't know how to stop `vite:json` from processing the transformed code so I just let it).

## Installation

```
npm install @eartharoid/vite-plugin-i18n
```

```ts
// vite.config.ts
import { I18nPlugin } from '@eartharoid/vite-plugin-i18n';

export default {
	plugins: [
		I18nPlugin({
			include: 'src/locales/*' // a picomatch pattern
		})
	],
};
```

## Configuration

```ts
interface I18nPluginOptions {
	exclude?: string | RegExp | Array<string | RegExp>,
	id_regex?: RegExp,
	include: string | RegExp | Array<string | RegExp>,
	parser?(src: string): string,
}
```

### `exclude`

A [picomatch](https://github.com/micromatch/picomatch#globbing-features) glob pattern for files to **not** process.

### `id_regex`

> Default: `/(?<id>[a-z-_]+)\.[a-z]+/i`

A RegExp with an `id` group to extract the `locale_id` from the import ID (file name/path).
You should only need to change this if you have multiple files for each locale (e.g. `/src/locales/en/home.json`).

### `include`

A [picomatch](https://github.com/micromatch/picomatch#globbing-features) glob pattern for files to process.

### `parser`

A function to parse the code if your messages are not stored in JSON files.

#### Example

```js
// vite.config.ts
import { I18nPlugin } from '@eartharoid/vite-plugin-i18n';
import { parse } from 'yaml'

export default {
	plugins: [
		I18nPlugin({
			include: 'src/locales/*', // a picomatch pattern
			parser: (code) => parse(code)
		})
	],
};
```

## Usage

```ts
// import the extended class **from the plugin**
import { I18n } from '@eartharoid/vite-plugin-i18n';

const locale_id = 'en';
const i18n = new I18n();
const t = i18n.load(await import(`./locales/${locale_id}.json`)).createTranslator();
// ...
t('message.key');
```