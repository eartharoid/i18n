import {
	beforeAll,
	describe,
	expect,
	test,
} from 'bun:test';
import {
	I18n,
	type MessageObject,
} from '../src/';
import { readFile } from 'fs/promises';
import type Locale from '../src/core/Locale';

const FIXTURES = './packages/i18n/tests/fixtures';

describe('deferred extraction', () => {
	let i18n: I18n;

	beforeAll(async () => {
		i18n = new I18n({ defer_extraction: true });
		i18n.load('en', JSON.parse(await readFile(`${FIXTURES}/en.json`, { encoding: 'utf8' })));
	});

	test('was it deferred?', () => {
		const locale = <Locale>i18n.locales.get('en');
		const expected = 'This is as simple as it gets';
		const actual = <MessageObject>locale.get('simple');
		expect('t' in actual).toBeFalse();
		expect(actual.o).toBe(expected);
	});


	test('does it work?', () => {
		const locale = <Locale>i18n.locales.get('en');
		const expected = 'This is as simple as it gets';
		const actual = locale.t('simple');
		expect(actual).toBe(expected);
	});
});
