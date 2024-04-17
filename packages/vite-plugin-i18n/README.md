# I18n Vite Plugin

This plugin converts your raw message JSON files into a new JSON object containing `cif` data and the `locale_id`,
which then gets turned into an ESM module by the internal `vite:json` plugin. 

The advantages of CIF are that it is smaller and slightly faster than JSON, however whilst making this:

- I realised vite converts JSON files into ESM modules, so there's no `JSON.parse()` needed at runtime.
- I found that after applying gzip/brotli compression, the size difference becomes insignificant.
- I made major optimisations to message loading/parsing to the point that even converting to I18n JSON rather than CIF offers minor benefits, over just importing a JSON file.

> [!TIP]
> **Should I use this?**
> 
> - Where you want to minimise the build size (such as for browser extensions) or most of your messages are used immediately, yes.
> - For websites served by a CDN that supports zip/brotli compression where most messages are not used immediately upon page load,
> ensuring that imported JSON files are converted to ESM modules and keeping deferred extraction enabled
> (both are defaults) is the most optimal.
>
> Refer to these comparisons for more information:
> - [File size comparisons](https://github.com/eartharoid/i18n/tree/main/packages/cif#file-sizes)
> - [Load speed comparisons](https://github.com/eartharoid/i18n/blob/main/README.md#benchmarks)

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

<!-- ```ts
// import the extended class **from the plugin**
import { I18n } from '@eartharoid/vite-plugin-i18n';

const locale_id = 'en';
const i18n = new I18n();
const t = i18n.load(await import(`./locales/${locale_id}.json`)).createTranslator();
// ...
t('message.key');
``` -->