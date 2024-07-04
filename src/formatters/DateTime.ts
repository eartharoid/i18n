import type {
	FormatterFactory,
	FactoryLocaleInserter,
} from '../types';

interface DateTimeFormatFactoryBuilder {
	(
		value?: Date | Date[],
		options?: Intl.DateTimeFormatOptions,
	): DateTimeFormatFactory
}

interface DateTimeFormatFactory
	extends
	PseudoSetters,
	Shortcuts,
	Modifiers,
	FormatterFactory {
	locales: Intl.Locale[],
	options: Intl.DateTimeFormatOptions,
	value?: Date | Date[],
	styleModifier?: 'dateStyle' | 'timeStyle'
}

// not literal `set`ters
interface PseudoSetters {
	calendar(calendar: string): this;
	numberingSystem(numberingSystem: string): this;
	hourCycle(hourCycle: 'h11' | 'h12' | 'h23' | 'h24'): this;
	timeZone(timeZone: string): this;
	weekday(weekday: 'long' | 'short' | 'narrow'): this;
	era(era: 'long' | 'short' | 'narrow'): this;
	year(year: 'numeric' | '2-digit'): this;
	month(month: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow'): this;
	day(day: 'numeric' | '2-digit'): this;
	dayPeriod(dayPeriod: 'long' | 'short' | 'narrow'): this;
	hour(hour: 'numeric' | '2-digit'): this;
	minute(minute: 'numeric' | '2-digit'): this;
	second(second: 'numeric' | '2-digit'): this;
	fractionalSecondDigits(fractionalSecondDigits: 1 | 2 | 3): this;
	timeZoneName(timeZoneName: 'long' | 'short' | 'longOffset' | 'shortOffset' | 'longGeneric' | 'shortGeneric'): this;
	dateStyle(dateStyle: 'full' | 'long' | 'medium' | 'short'): this;
	timeStyle(timeStyle: 'full' | 'long' | 'medium' | 'short'): this;
}

interface Modifiers {
	date(): this
	time(): this
}

interface Shortcuts {
	h11(): this;
	h12(): this;
	h23(): this;
	h24(): this;
	full(): this;
	long(): this;
	medium(): this;
	short(): this;
}

// Intl.DateTimeFormatOptions is missing fractionalSecondDigits
const pseudo_setter_keys: (keyof PseudoSetters)[] = [
	'calendar',
	'numberingSystem',
	'hourCycle',
	'timeZone',
	'weekday',
	'era',
	'year',
	'month',
	'day',
	'dayPeriod',
	'hour',
	'minute',
	'second',
	'fractionalSecondDigits',
	'timeZoneName',
	'dateStyle',
	'timeStyle',
];

const pseudo_setters = pseudo_setter_keys
	.reduce(
		(acc, key) => {
			acc[key] = function (value: unknown) {
				this.options[key] = value;
				return this;
			};
			return acc;
		},
		{} as PseudoSetters
	);

function DateTimeFormat(locales: Intl.Locale[]): DateTimeFormatFactoryBuilder {
	return (value = new Date(), options = {}) => {
		const factory: Omit<DateTimeFormatFactory, keyof PseudoSetters> = {
			locales,
			options,
			value,
			// modifiers
			date() {
				this.styleModifier = 'dateStyle';
				return this;
			},
			time() {
				this.styleModifier = 'timeStyle';
				return this;
			},
			// shortcuts
			h11() {
				this.options.hourCycle = 'h11';
				return this;
			},
			h12() {
				this.options.hourCycle = 'h12';
				return this;
			},
			h23() {
				this.options.hourCycle = 'h23';
				return this;
			},
			h24() {
				this.options.hourCycle = 'h24';
				return this;
			},
			full() {
				if (this.styleModifier === undefined) throw new Error('`full()` must be preceded by a `date()` or `time()` modifier');
				this.options[this.styleModifier] = 'full';
				return this;
			},
			long() {
				if (this.styleModifier === undefined) throw new Error('`full()` must be preceded by a `date()` or `time()` modifier');
				this.options[this.styleModifier] = 'long';
				return this;
			},
			medium() {
				if (this.styleModifier === undefined) throw new Error('`full()` must be preceded by a `date()` or `time()` modifier');
				this.options[this.styleModifier] = 'medium';
				return this;
			},
			short() {
				if (this.styleModifier === undefined) throw new Error('`full()` must be preceded by a `date()` or `time()` modifier');
				this.options[this.styleModifier] = 'short';
				return this;
			},
			get result() {
				const formatter = new Intl.DateTimeFormat(this.locales, this.options);
				// @ts-ignore yes it does
				if (this.value instanceof Array) return formatter.formatRange(...this.value);
				else return formatter.format(this.value);
			},
		};
		return Object.assign(factory, pseudo_setters);
	};
}

export default <FactoryLocaleInserter<DateTimeFormatFactoryBuilder>>DateTimeFormat;