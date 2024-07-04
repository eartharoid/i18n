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
	defer_extraction: true,
});
for (const [k, v] of Object.entries(locales)) i18n.load(k, v);

test('was it deferred?', t => {
	let locale = i18n.locales.get('en');
	const expected = 'This is as simple as it gets';
	const actual = locale.get('simple');
	t.true(actual.o === expected && actual.t === undefined);
});


test('does it work?', t => {
	let locale = i18n.locales.get('en');
	const expected = 'This is as simple as it gets';
	const actual = locale.t('simple');
	t.is(actual, expected);
});