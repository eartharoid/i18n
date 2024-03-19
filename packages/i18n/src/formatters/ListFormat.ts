import type {
	FormatterFactory,
	FormatterFactoryBuilder,
} from '../types';

interface ListFormatFactory extends FormatterFactory {
	locales: Intl.Locale[];
	// options: Intl.NumberFormatOptions,
	options: {
		type: 'conjunction' | 'disjunction' | 'unit';
		style: 'long' | 'short' | 'narrow';
	},
	conjunction(): this;
	disjunction(): this;
	unit(): this;
	long(): this;
	short(): this;
	narrow(): this;
	value: string[];
}

export default <FormatterFactoryBuilder>function ListFormat(locales: Intl.Locale[]) {
	return (value: string[]): ListFormatFactory => {
		return {
			locales,
			options: {
				// same defaults as the underlying API
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat/ListFormat#options
				type: 'conjunction',
				style: 'long',
			},
			value,
			conjunction() {
				this.options.type = 'conjunction';
				return this;
			},
			disjunction() {
				this.options.type = 'disjunction';
				return this;
			},
			unit() {
				this.options.type = 'unit';
				return this;
			},
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
			get result(): string {
				// @ts-ignore yes it does
				const formatter = new Intl.ListFormat(this.locales, this.options);
				return formatter.format(this.value);
			},
		};
	};
};