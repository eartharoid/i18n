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
	defer_extraction: false,
});
for (const [k, v] of Object.entries(locales)) i18n.load(k, v);
i18n.fallback('en');

test('not missing', t => {
	const expected = 'Dette er så enkelt som det blir';
	const actual = i18n.t('no', 'simple');
	t.is(actual, expected);
});

test('missing translation', t => {
	const expected = 'Hello';
	const actual = i18n.t('no', 'english_only.nested.deeply');
	t.is(actual, expected);
});