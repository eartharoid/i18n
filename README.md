# i18n

Simple and lightweight message localisation for JavaScript projects.

## Installation

- `pnpm add @eartharoid/i18n` or
- `yarn add @eartharoid/i18n` or
- `npm i @eartharoid/i18n`

## Usage

```js
const I18n = require('@eartharoid/i18n');
const i18n = new I18n('english', {
	english: {
		example: 'Hello, world'
	},
	russian: {
		example: 'https://www.youtube.com/watch?v=bwnksI2ZoJI'
	}
});

// note: you should check if the locale exists in i18n.locales first
const messages = i18n.getLocale('russian'); // get the locale
console.log(messages('example')); // -> https://www.youtube.com/watch?v=bwnksI2ZoJI

// this code does exactly the same
console.log(i18n.getMessage('russian', 'example'));
```

### Placeholders

i18n supports both positional and named placeholders.

```js
{ // a locale object
	"positional": {
		"strings": "I like %s", 
		"numbers": "%d %s %d = %d"
	},
	"named": {
		"example1": "Hi, I'm {name} and I am from {location}",
		"example2": "Hi, I'm {person.name} and I am from {person.location}"
	}
}
```

> Also note that messages and named placeholders can be nested

```js
messages('positional.strings', 'chocolate'); // I like chocolate

messages('positional.numbers', 5, '+', 5, 10); // 5 + 5 = 10

messages('named.example1', {
	name: 'Someone',
	location: 'Somewhere'
}); // Hi, I'm Someone and I am from Somewhere

messages('named.example2', {
	person: {
		name: 'Someone',
		location: 'Somewhere'
	}
}); // Hi, I'm Someone and I am from Somewhere
```

### Pluralisation

i18n supports basic pluralisation. If the message is an array, **the first placeholder value will be "eaten" (consumed)** and the correct message will be returned.

```js
[
	"1",
	"anything else"
]
```

or

```js
[
	"0",
	"1",
	"anything else"
]
```

```js
{ // a locale object
	"example1": [
		"You only have one %s",
		"You have %d %ss"
	],
	"example2": [
		"You don't have any {item}s",
		"You only have one {item}",
		"You have {number} {item}s"
	]
}
```

```js
messages('example1', 1, 1, 'item')
messages('example2', 0, {
	number: 0,
	item: 'car'
})
```

### API

#### `new I18n(default_locale, locales)`

> Create a new I18n instance

- `default_locale` - the name of the default locale
- `locales` - an object of localised messages

#### `I18n#default_locale`

> The name of the default locale

#### `I18n#locales`

> An array of the names of the locales you created

#### `I18n#getAllMessages(message, ...args)`

> Get a message in all locales

- `message` - dot notation string for the message
- `...args` - placeholders/pluralisation

#### `I18n#getLocale(locale)`

> Get a locale

- `locale` - locale name

Returns a function which calls [`I18n#getMessage`](#i18ngetmessagelocale-message-args) using the given locale name (or the default).

#### `I18n#getMessage(locale, message, ...args)`

> Get a message from a specific locale

- `locale` - locale name
- `message` - dot notation string for the message
- `...args` - placeholders/pluralisation

#### `I18n#getMessages(locales, message, ...args)`

> Get a message from multiple locales

- `locales` - array of locale names
- `message` - dot notation string for the message
- `...args` - placeholders/pluralisation

## Support

[![Discord support server](https://discordapp.com/api/guilds/451745464480432129/widget.png?style=banner4)](https://lnk.earth/discord)

## Donate

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/eartharoid)

## License

[MIT license](https://github.com/eartharoid/i18n/blob/master/LICENSE).

© 2022 Isaac Saunders
