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
	defer_extraction: false,
});
for (const [k, v] of Object.entries(locales)) i18n.load(k, v);
// i18n.locales.forEach((v, k) => fs.writeFileSync(`test/compiled/${k}.i18n.json`, JSON.stringify(Object.fromEntries(v), null, 2)));


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

test('getLocale en', t => {
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

// this doesn't work (`this` is undefined) which is why Locale#createTranslator exists
// test('getLocale w/ destructuring', t => {
// 	let { t: translate } = i18n.locales.get('en');
// 	const expected = 'This is as simple as it gets';
// 	const actual = translate('simple');
// 	t.is(actual, expected);
// });

test('I18nLite#createTranslator', t => {
	const translate = i18n.createTranslator('en');
	const expected = 'This is as simple as it gets';
	const actual = translate('simple');
	t.is(actual, expected);
});

test('Locale#createTranslator', t => {
	const translate = i18n.locales.get('en').createTranslator();
	const expected = 'This is as simple as it gets';
	const actual = translate('simple');
	t.is(actual, expected);
});

test('named placeholders example', t => {
	const expected = 'This is an example using {named} placeholders';
	const actual = i18n.t('en', 'placeholder_variables.example', {
		word: 'example'
	});
	t.is(actual, expected);
});

test('plural age 0', t => {
	// const expected = 'You were born recently';
	// ? You might expect `0` to select `zero`, but most languages don't have a `zero` plural form:
	// ? https://www.unicode.org/cldr/charts/43/supplemental/language_plural_rules.html#en
	const expected = 'You were born recently';
	const actual = i18n.t('en', 'plural.age', { age: 0 });
	t.is(actual, expected);
});

test('plural age 1', t => {
	const expected = 'You were born a year ago';
	const actual = i18n.t('en', 'plural.age', { age: 1 });
	t.is(actual, expected);
});


test('plural age 17', t => {
	const expected = 'You were born 17 years ago';
	const actual = i18n.t('en', 'plural.age', { age: 17 });
	t.is(actual, expected);
});

test('plural vehicles 0', t => {
	const expected = 'You own 0 cars';
	const actual = i18n.t('en', 'plural.vehicles', {
		vehicles: {
			count: 0,
			type: 'car'
		}
	});
	t.is(actual, expected);
});

test('plural vehicles 1', t => {
	const expected = 'You own a single car';
	const actual = i18n.t('en', 'plural.vehicles', {
		vehicles: {
			count: 1,
			type: 'car'
		}
	});
	t.is(actual, expected);
});

test('plural vehicles 3', t => {
	const expected = 'You own 3 cars';
	const actual = i18n.t('en', 'plural.vehicles', {
		vehicles: {
			count: 3,
			type: 'car'
		}
	});
	t.is(actual, expected);
});

test('ordinal 1', t => {
	const expected = 'You are 1st in the queue';
	const actual = i18n.t('en', 'ordinal.position', { position: 1 });
	t.is(actual, expected);
});

test('ordinal 2', t => {
	const expected = 'You are 2nd in the queue';
	const actual = i18n.t('en', 'ordinal.position', { position: 2 });
	t.is(actual, expected);
});

test('ordinal 3', t => {
	const expected = 'You are 3rd in the queue';
	const actual = i18n.t('en', 'ordinal.position', { position: 3 });
	t.is(actual, expected);
});

test('ordinal 4', t => {
	const expected = 'You are 4th in the queue';
	const actual = i18n.t('en', 'ordinal.position', { position: 4 });
	t.is(actual, expected);
});

test('wrong/missing variable', t => {
	t.throws(
		() => i18n.t('en', 'ordinal.position', { test: 69 }),
		{ message: /number\/array value/ }
	);
});

test('repeated', t => {
	const expected = 'hello hello hello is repeated';
	const actual = i18n.t('en', 'repeated', { word: 'hello' });
	t.is(actual, expected);
});

test('nesting', t => {
	const expected = 'There are 17 boys and 12 girls';
	const actual = i18n.t('en', 'placeholder_getters.together', {
		boys: 17,
		girls: 12
	});
	t.is(actual, expected);
});

test('nesting passthrough', t => {
	const expected = 'There are 2 classrooms';
	const actual = i18n.t('en', 'placeholder_getters.passthrough', { classrooms: 2 });
	t.is(actual, expected);
});

test('circular protection', t => {
	t.throws(
		() => i18n.t('en', 'circular_1'),
		{ message: /exceeded nesting limit/ }
	);
});