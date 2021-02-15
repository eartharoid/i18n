# i18n

Lightweight localisation.

## Installation

- `pnpm i @eartharoid/i18n` or
- `yarn add @eartharoid/i18n` or
- `npm i @eartharoid/i18n`

## Usage

### Localisation files

`en-GB.json`:

```json
{
	"hello": "Hello!",
	"hello_name": "Hello, %s!",
	"other": {
		"age": [
			"1 year old",
			"%d years old"
		]
	}
}
```

### Your code

See [test/index.js](https://github.com/eartharoid/i18n/blob/main/test/index.js).

```js
const I18n = require('@eartharoid/i18n'); // require module
const i18n = new I18n('src/locales', 'en-GB'); // create new instance, first value is the locales directory relative to where the process was started, second value is the default locale

const en = i18n.get(); // get default locale
const fr = i18n.get('fr-FR'); // get specified locale

console.log('en', en('hello')); // get english translation of 'hello' key
console.log('fr', fr('hello')); // get french translation of 'hello' key

console.log('en', en('hello_name', 'Isaac')); // english with placeholder
console.log('fr', fr('hello_name', 'Isaac')); // french with placeholder

// keys can be nested
console.log('en', en('other.age', 1)); // age[0] if first argument is 1
console.log('en', en('other.age', 21)); // age[1] if first argument is not 1
console.log('fr', fr('other.age', 1));
console.log('fr', fr('other.age', 21));
```

## Support

[![Discord support server](https://discordapp.com/api/guilds/451745464480432129/widget.png?style=banner4)](https://discord.gg/pXc9vyC)

## Donate

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/eartharoid)