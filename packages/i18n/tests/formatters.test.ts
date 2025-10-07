import {
	beforeAll,
	describe,
	expect,
	test,
} from 'bun:test';
import {
	I18n, formatters,
} from '../src';
import { readFile } from 'fs/promises';

const FIXTURES = './packages/i18n/tests/fixtures';

describe('formatters', () => {
	let i18n: I18n;

	beforeAll(async () => {
		i18n = new I18n({
			defer_extraction: true,
			formatters,
		});
		i18n.load('en', JSON.parse(await readFile(`${FIXTURES}/en.json`, { encoding: 'utf8' })));
	});

	test('DateTime', () => {
		const d = new Date('2024-03-19T15:02:58');
		const expected = 'The time is 3:02 PM'; // why does en use en-US 😠
		const actual = i18n.t('en', 'time', { time: ({ DateTime }) => DateTime(d).time().short() });
		expect(actual).toBe(expected);
	});

	test('DateTime (range)', () => {
		const d1 = new Date('2024-03-19');
		const d2 = new Date('2024-03-20');
		const expected = 'The promotion is available between 3/19/24 – 3/20/24'; // why does en use en-US 😠
		const actual = i18n.t('en', 'date_range', { range: ({ DateTime }) => DateTime([d1, d2]).date().short() });
		expect(actual).toBe(expected);
	});

	test('List', () => {
		const expected = 'Did you travel by bike, car, or bus?';
		const actual = i18n.t('en', 'list', { list: ({ List }) => List(['bike', 'car', 'bus']).disjunction() });
		expect(actual).toBe(expected);
	});


	test('RelativeTime', () => {
		const expected = 'I ate chocolate yesterday';
		const actual = i18n.t('en', 'relative_past', { relative: ({ RelativeTime }) => RelativeTime(-1, 'day').auto() });
		expect(actual).toBe(expected);
	});

});




