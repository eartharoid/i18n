import { I18n } from '../dist/index.js';
import * as formatters from '../dist/formatters/index.js';
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
	formatters
});
for (const [k, v] of Object.entries(locales)) i18n.load(k, v);

test('DateTime', t => {
	const d = new Date('2024-03-19T15:02:58');
	const expected = 'The time is 3:02 PM'; // why does en use en-US 😠
	const actual = i18n.t('en', 'time', {
		time: ({ DateTime }) => DateTime(d).time().short()
	});
	t.is(actual, expected);
});


test('List', t => {
	const expected = 'Did you travel by bike, car, or bus?';
	const actual = i18n.t('en', 'list', {
		list: ({ List }) => List(['bike', 'car', 'bus']).disjunction()
	});
	t.is(actual, expected);
});
