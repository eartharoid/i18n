import {
	beforeAll,
	describe,
	expect,
	test,
} from 'bun:test';
import { I18n } from '../src/';
import { readFile } from 'fs/promises';


const FIXTURES = './packages/i18n/tests/fixtures';

describe('namespaces', () => {
	let i18n: I18n;

	beforeAll(async () => {
		i18n = new I18n({ defer_extraction: true });
		i18n.load('en', JSON.parse(await readFile(`${FIXTURES}/en.json`, { encoding: 'utf8' })), 'common');
	});

	test('prefixed', () => {
		const translate = i18n.createTranslator('en');
		const expected = 'This is as simple as it gets';
		const actual = translate('common:simple');
		expect(actual).toBe(expected);
	});

	test('non-prefixed', () => {
		expect(() => i18n.t('en', 'simple')).toThrow(/does not exist/);
	});
});

