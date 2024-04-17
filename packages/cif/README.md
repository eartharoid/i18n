# Compact Interpolation Format

CIF is a specialised format for storing parsed (placeholder-extracted) messages more efficiently than JSON.

Although the JavaScript decoder algorithm is only around 3% faster than the C++ `JSON.parse()`,
CIF is substantially smaller than minified I18n JSON
and is even smaller than the original input JSON (or very nearly if it is minified).


## File sizes

### FAST (I18n-parsed messages)

```diff
+cif         12.6 KB (+ 1.3 KB of code = 13.9 KB)
 cif.gz      5.1 KB  (+ 0.6 KB of code = 5.7 KB)
 cif.br      4.3 KB  (+ 0.5 KB of code = 4.8 KB)
-json        30.3 KB
 json.gz     6.2 KB
 json.br     5.2 KB
-min.json    19.4 kB
 min.json.gz 5.8 KB
 min.json.br 4.9 KB
```

### SLOW (raw messages)

```diff
-json        15.9 KB
 json.gz     5.3 KB
 json.br     4.3 KB
 min.json    12.2 kB
 min.json.gz 4.9 KB
 min.json.br 4.0 KB
```

## Installation

```
npm install @eartharoid/cif @eartharoid/i18n
```

## Usage

### Encoding

```js
import { I18n } from '@eartharoid/i18n';
import { mtoc } from '@eartharoid/cif';

function encode(messages) {
	// deferred extraction must be disabled
	const i18n = new I18n({ defer_extraction: false });
	const parsed = i18n.parse(messages);
	return mtoc(parsed);
}
```

### Decoding

```js
import { I18nLite } from '@eartharoid/i18n';
import { ctom } from '@eartharoid/cif';

const i18n = new I18nLite();
i18n.loadParsed('en', ctom(cif));

```