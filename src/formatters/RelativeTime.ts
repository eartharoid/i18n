import type {
	FormatterFactory,
	FactoryLocaleInserter,
} from '../types';

interface RelativeTimeFormatFactoryBuilder {
	(
		value: number,
		unit: Intl.RelativeTimeFormatUnit,
		options?: Intl.RelativeTimeFormatOptions,
	): RelativeTimeFormatFactory
}

interface RelativeTimeFormatFactory
	extends
	PseudoSetters,
	Shortcuts,
	// Modifiers,
	FormatterFactory {
	locales: Intl.Locale[],
	options: Intl.RelativeTimeFormatOptions,
	value: number,
	unit: Intl.RelativeTimeFormatUnit,
}

// not literal `set`ters
interface PseudoSetters {
	numberingSystem(numberingSystem: string): this;
	style(style: 'long' | 'short' | 'narrow'): this;
	numeric(numeric: 'always' | 'auto'): this;
}

// interface Modifiers {
// }

interface Shortcuts {
	long(): this,
	short(): this,
	narrow(): this,
	always(): this,
	auto(): this,
}

// Intl.RelativeTimeFormatOptions is missing fractionalSecondDigits
const pseudo_setter_keys: (keyof PseudoSetters)[] = [
	'numberingSystem',
	'style',
	'numeric',
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

function RelativeTimeFormat(locales: Intl.Locale[]): RelativeTimeFormatFactoryBuilder {
	return (value, unit, options = {}) => {
		const factory: Omit<RelativeTimeFormatFactory, keyof PseudoSetters> = {
			locales,
			options,
			value,
			unit,
			long() {
				this.options.style = 'long';
				return this;
			},
			short() {
				this.options.style = 'short';
				return this;
			},
			narrow() {
				this.options.style = 'narrow';
				return this;
			},
			always() {
				this.options.numeric = 'always';
				return this;
			},
			auto() {
				this.options.numeric = 'auto';
				return this;
			},
			get result() {
				const formatter = new Intl.RelativeTimeFormat(this.locales, this.options);
				// @ts-ignore yes it does
				if (this.value instanceof Array) return formatter.formatRange(...this.value);
				else return formatter.format(this.value, this.unit);
			},
		};
		return Object.assign(factory, pseudo_setters);
	};
}

export default <FactoryLocaleInserter<RelativeTimeFormatFactoryBuilder>>RelativeTimeFormat;