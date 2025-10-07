import {
	beforeAll,
	expect,
	test,
} from 'bun:test';
import { I18n } from '../src';
import { readFile } from 'fs/promises';

const FIXTURES = './packages/i18n/tests/fixtures';

let i18n: I18n;

beforeAll(async () => {
	i18n = new I18n({
		default_locale_id: 'en',
		defer_extraction: false,
	});
	for (const l of ['en', 'no']) {
		i18n.load(l, JSON.parse(await readFile(`${FIXTURES}/${l}.json`, { encoding: 'utf8' })));
	}
	i18n.fallback();
});

test('not missing', () => {
	const expected = 'Dette er så enkelt som det blir';
	const actual = i18n.t('no', 'simple');
	expect(actual).toBe(expected);
});

test('missing translation', () => {
	const expected = 'Hello';
	const actual = i18n.t('no', 'english_only.nested.deeply');
	expect(actual).toBe(expected);
});