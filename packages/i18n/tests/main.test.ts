import {
	beforeAll,
	describe,
	expect,
	test,
} from 'bun:test';
import { I18n } from '../src';
import { readFile } from 'fs/promises';
import type Locale from '../src/core/Locale';

const FIXTURES = './packages/i18n/tests/fixtures';

describe('messy tests', () => {
	let i18n: I18n;

	beforeAll(async () => {
		i18n = new I18n({
			default_locale_id: 'en',
			defer_extraction: false,
		});
		i18n.load('en', JSON.parse(await readFile(`${FIXTURES}/en.json`, { encoding: 'utf8' })));
		i18n.load('no', JSON.parse(await readFile(`${FIXTURES}/no.json`, { encoding: 'utf8' })));
	});



	test('getMessage en', () => {
		const expected = 'This is as simple as it gets';
		const actual = i18n.t('en', 'simple');
		expect(actual).toBe(expected);
	});

	test('getMessage no', () => {
		const expected = 'Dette er så enkelt som det blir';
		const actual = i18n.t('no', 'simple');
		expect(actual).toBe(expected);
	});

	test('getLocale en', () => {
		const locale = <Locale>i18n.locales.get('en');
		const expected = 'This is as simple as it gets';
		const actual = locale.t('simple');
		expect(actual).toBe(expected);
	});

	test('getLocale no', () => {
		const locale = <Locale>i18n.locales.get('no');
		const expected = 'Dette er så enkelt som det blir';
		const actual = locale.t('simple');
		expect(actual).toBe(expected);
	});

	// this doesn't work (`this` is undefined) which is why Locale#createTranslator exists
	// test('getLocale w/ destructuring', () => {
	// 	let { t: translate } = i18n.locales.get('en');
	// 	const expected = 'This is as simple as it gets';
	// 	const actual = translate('simple');
	// 	expect(actual).toBe(expected);
	// });

	test('I18nCore#createTranslator', () => {
		const translate = i18n.createTranslator('en');
		const expected = 'This is as simple as it gets';
		const actual = translate('simple');
		expect(actual).toBe(expected);
	});

	test('Locale#createTranslator', () => {
		const translate = (<Locale>i18n.locales.get('en')).createTranslator();
		const expected = 'This is as simple as it gets';
		const actual = translate('simple');
		expect(actual).toBe(expected);
	});

	test('named placeholders example', () => {
		const expected = 'This is an example using {named} placeholders';
		const actual = i18n.t('en', 'placeholder_variables.example', { word: 'example' });
		expect(actual).toBe(expected);
	});

	test('plural age 0', () => {
		// const expected = 'You were born recently';
		// ? You might expect `0` to select `zero`, but most languages don't have a `zero` plural form:
		// ? https://www.unicode.org/cldr/charts/43/supplemental/language_plural_rules.html#en
		const expected = 'You were born recently';
		const actual = i18n.t('en', 'plural.age', { age: 0 });
		expect(actual).toBe(expected);
	});

	test('plural age 1', () => {
		const expected = 'You were born a year ago';
		const actual = i18n.t('en', 'plural.age', { age: 1 });
		expect(actual).toBe(expected);
	});


	test('plural age 17', () => {
		const expected = 'You were born 17 years ago';
		const actual = i18n.t('en', 'plural.age', { age: 17 });
		expect(actual).toBe(expected);
	});

	test('plural vehicles 0', () => {
		const expected = 'You own 0 cars';
		const actual = i18n.t('en', 'plural.vehicles', {
			vehicles: {
				count: 0,
				type: 'car',
			},
		});
		expect(actual).toBe(expected);
	});

	test('plural vehicles 1', () => {
		const expected = 'You own a single car';
		const actual = i18n.t('en', 'plural.vehicles', {
			vehicles: {
				count: 1,
				type: 'car',
			},
		});
		expect(actual).toBe(expected);
	});

	test('plural vehicles 3', () => {
		const expected = 'You own 3 cars';
		const actual = i18n.t('en', 'plural.vehicles', {
			vehicles: {
				count: 3,
				type: 'car',
			},
		});
		expect(actual).toBe(expected);
	});

	test('ordinal 1', () => {
		const expected = 'You are 1st in the queue';
		const actual = i18n.t('en', 'ordinal.position', { position: 1 });
		expect(actual).toBe(expected);
	});

	test('ordinal 2', () => {
		const expected = 'You are 2nd in the queue';
		const actual = i18n.t('en', 'ordinal.position', { position: 2 });
		expect(actual).toBe(expected);
	});

	test('ordinal 3', () => {
		const expected = 'You are 3rd in the queue';
		const actual = i18n.t('en', 'ordinal.position', { position: 3 });
		expect(actual).toBe(expected);
	});

	test('ordinal 4', () => {
		const expected = 'You are 4th in the queue';
		const actual = i18n.t('en', 'ordinal.position', { position: 4 });
		expect(actual).toBe(expected);
	});

	test('wrong/missing variable', () => {
		expect(() => i18n.t('en', 'ordinal.position', { test: 69 })).toThrow(/number\/array value/);
	});

	test('repeated', () => {
		const expected = 'hello hello hello is repeated';
		const actual = i18n.t('en', 'repeated', { word: 'hello' });
		expect(actual).toBe(expected);
	});

	test('nesting', () => {
		const expected = 'There are 17 boys and 12 girls';
		const actual = i18n.t('en', 'placeholder_getters.together', {
			boys: 17,
			girls: 12,
		});
		expect(actual).toBe(expected);
	});

	test('nesting passthrough', () => {
		const expected = 'There are 2 classrooms';
		const actual = i18n.t('en', 'placeholder_getters.passthrough', { classrooms: 2 });
		expect(actual).toBe(expected);
	});

	test('circular protection', () => {
		expect(() => i18n.t('en', 'circular_1')).toThrow(/exceeded nesting limit/);
	});
});
