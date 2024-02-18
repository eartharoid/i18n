import { I18n } from '../dist/index.js';
import fs from 'fs';
import test from 'ava';

let locales = {};
fs.readdirSync('test/locales')
	.filter(file => file.endsWith('.json'))
	.forEach(file => {
		let data = fs.readFileSync(`test/locales/${file}`, {
			encoding: 'utf8'
		});
		let name = file.slice(0, file.length - 5);
		locales[name] = JSON.parse(data);
	});

const i18n = new I18n({
	default_locale_id: 'en',
});
for (const [k, v] of Object.entries(locales)) i18n.load(k, v);
// i18n.locales.forEach((v, k) => fs.writeFileSync(`test/compiled/${k}.i18n.json`, JSON.stringify(Object.fromEntries(v), null, 2)));


test('default_locale_id', t => {
	const expected = 'en';
	const actual = i18n.default_locale_id;
	t.is(actual, expected);
});

test('getLocale', t => {
	let locale = i18n.locales.get('en');
	const expected = 'This is as simple as it gets';
	const actual = locale.t('simple');
	t.is(actual, expected);
});

test('getLocale no', t => {
	let locale = i18n.locales.get('no');
	const expected = 'Dette er så enkelt som det blir';
	const actual = locale.t('simple');
	t.is(actual, expected);
});

test('getMessage en', t => {
	const expected = 'This is as simple as it gets';
	const actual = i18n.t('en', 'simple');
	t.is(actual, expected);
});

test('getMessage no', t => {
	const expected = 'Dette er så enkelt som det blir';
	const actual = i18n.t('no', 'simple');
	t.is(actual, expected);
});

test('positional placeholders 1', t => {
	const expected = 'This is an example using positional placeholders (%s)';
	const actual = i18n.t('en', 'positional_placeholders.1', 'example');
	t.is(actual, expected);
});

test('positional placeholders 2', t => {
	const expected = 'This is an example using 2 positional placeholders';
	const actual = i18n.t('en', 'positional_placeholders.2', 'example', 2);
	t.is(actual, expected);
});

test('named placeholders example', t => {
	const expected = 'This is an example using {named} placeholders';
	const actual = i18n.t('en', 'named_placeholders.example', {
		word: 'example'
	});
	t.is(actual, expected);
});

test('plural age 0', t => {
	// const expected = 'You were born recently';
	// ? You might expect `0` to select `zero`, but most languages don't have a `zero` plural form:
	// ? https://www.unicode.org/cldr/charts/43/supplemental/language_plural_rules.html#en
	t.throws(
		() => i18n.t('en', 'plural.age.?', 0),
		{ message: /placeholder is required/ }
	);
});

test('plural age 1 (.?)', t => {
	const expected = 'You were born a year ago';
	const actual = i18n.t('en', 'plural.age.?', 1);
	t.is(actual, expected);
});

test('plural age 1 (.?c)', t => {
	const expected = 'You were born a year ago';
	const actual = i18n.t('en', 'plural.age.?c', 1);
	t.is(actual, expected);
});

test('plural age 17', t => {
	const expected = 'You were born 17 years ago';
	const actual = i18n.t('en', 'plural.age.?', 17, 17);
	t.is(actual, expected);
});

test('plural vehicles 0', t => {
	const expected = 'You own 0 cars';
	const actual = i18n.t('en', 'plural.vehicles.?', 0, {
		vehicles: {
			count: 0,
			type: 'car'
		}
	});
	t.is(actual, expected);
});

test('plural vehicles 1', t => {
	const expected = 'You own a single car';
	const actual = i18n.t('en', 'plural.vehicles.?', 1, {
		vehicles: {
			count: 1,
			type: 'car'
		}
	});
	t.is(actual, expected);
});

test('plural vehicles 3', t => {
	const expected = 'You own 3 cars';
	const actual = i18n.t('en', 'plural.vehicles.?', 3, {
		vehicles: {
			count: 3,
			type: 'car'
		}
	});
	t.is(actual, expected);
});


test('ordinal 1 (.?o)', t => {
	const expected = 'You are 1st in the queue';
	const actual = i18n.t('en', 'ordinal.position.?o', 1, 1);
	t.is(actual, expected);
});

test('ordinal 2 (.?o)', t => {
	const expected = 'You are 2nd in the queue';
	const actual = i18n.t('en', 'ordinal.position.?o', 2, 2);
	t.is(actual, expected);
});

test('ordinal 3 (.?o)', t => {
	const expected = 'You are 3rd in the queue';
	const actual = i18n.t('en', 'ordinal.position.?o', 3, 3);
	t.is(actual, expected);
});

test('ordinal 4 (.?o)', t => {
	const expected = 'You are 4th in the queue';
	const actual = i18n.t('en', 'ordinal.position.?o', 4, 4);
	t.is(actual, expected);
});

test('missing translation', t => {
	const expected = 'Hello';
	const actual = i18n.t('no', 'english_only.nested.deeply');
	t.is(actual, expected);
});