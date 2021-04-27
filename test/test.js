let locales = {};

const fs = require('fs');
fs.readdirSync('test/locales')
	.filter(file => file.endsWith('.json'))
	.forEach(file => {
		let data = fs.readFileSync(`test/locales/${file}`, {
			encoding: 'utf8'
		});
		let name = file.slice(0, file.length - 5);
		locales[name] = JSON.parse(data);
	});


const I18n = require('../dist');
const i18n = new I18n('original', locales);

const test = require('ava');

test('getLocale', t => {
	let locale = i18n.getLocale();
	const expected = 'This is as simple as it gets';
	const actual = locale('simple');
	t.is(actual, expected);
});

test('getLocale translated', t => {
	let locale = i18n.getLocale('translated');
	const expected = 'Dette er så enkelt som det blir';
	const actual = locale('simple');
	t.is(actual, expected);
});

test('getMessage original', t => {
	const expected = 'This is as simple as it gets';
	const actual = i18n.getMessage('original', 'simple');
	t.is(actual, expected);
});

test('getMessage translated', t => {
	const expected = 'Dette er så enkelt som det blir';
	const actual = i18n.getMessage('translated', 'simple');
	t.is(actual, expected);
});

test('positional placeholders 1', t => {
	const expected = 'This is an example using positional placeholders (\\%s)';
	const actual = i18n.getMessage('original', 'positional_placeholders.1', 'example');
	t.is(actual, expected);
});

test('positional placeholders 2', t => {
	const expected = 'This is an example using 2 positional placeholders';
	const actual = i18n.getMessage('original', 'positional_placeholders.2', 'example', 2);
	t.is(actual, expected);
});

test('named placeholders example', t => {
	const expected = 'This is an example using \\{named\\} placeholders';
	const actual = i18n.getMessage('original', 'named_placeholders.example', {
		word: 'example'
	});
	t.is(actual, expected);
});

test('plural age 0', t => {
	const expected = 'You were born recently';
	const actual = i18n.getMessage('original', 'plural.age', 0);
	t.is(actual, expected);
});

test('plural age 1', t => {
	const expected = 'You were born a year ago';
	const actual = i18n.getMessage('original', 'plural.age', 1);
	t.is(actual, expected);
});

test('plural age 17', t => {
	const expected = 'You were born 17 years ago';
	const actual = i18n.getMessage('original', 'plural.age', 17, 17);
	t.is(actual, expected);
});

test('plural vehicles 0', t => {
	const expected = 'You own 0 cars';
	const actual = i18n.getMessage('original', 'plural.vehicles', 0, {
		vehicles: {
			count: 0,
			type: 'car'
		}
	});
	t.is(actual, expected);
});

test('plural vehicles 1', t => {
	const expected = 'You own a single car';
	const actual = i18n.getMessage('original', 'plural.vehicles', 1, {
		vehicles: {
			count: 1,
			type: 'car'
		}
	});
	t.is(actual, expected);
});

test('plural vehicles 3', t => {
	const expected = 'You own 3 cars';
	const actual = i18n.getMessage('original', 'plural.vehicles', 3, {
		vehicles: {
			count: 3,
			type: 'car'
		}
	});
	t.is(actual, expected);
});