import type {
	FormatterFactory,
	FactoryLocaleInserter,
} from '../types';

interface ListFormatFactoryBuilder {
	(value: string[]): ListFormatFactory
}

interface ListFormatFactory extends FormatterFactory {
	locales: Intl.Locale[];
	// options: Intl.NumberFormatOptions,
	options: {
		type?: 'conjunction' | 'disjunction' | 'unit';
		style?: 'long' | 'short' | 'narrow';
	},
	// options
	type(type: 'conjunction' | 'disjunction' | 'unit'): this;
	style(style: 'long' | 'short' | 'narrow'): this;
	// shortcuts
	conjunction(): this;
	and(): this;
	disjunction(): this;
	or(): this;
	unit(): this;
	long(): this;
	short(): this;
	narrow(): this;
	value: string[];
}

export default <FactoryLocaleInserter<ListFormatFactoryBuilder>>function ListFormat(locales: Intl.Locale[]) {
	return (value: string[], options: ListFormatFactory['options'] = {}): ListFormatFactory => {
		return {
			locales,
			options,
			value,
			type(type) {
				this.options.type = type;
				return this;
			},
			conjunction() {
				this.options.type = 'conjunction';
				return this;
			},
			and() {
				this.options.type = 'conjunction';
				return this;
			},
			disjunction() {
				this.options.type = 'disjunction';
				return this;
			},
			or() {
				this.options.type = 'disjunction';
				return this;
			},
			unit() {
				this.options.type = 'unit';
				return this;
			},
			style(style) {
				this.options.style = style;
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
			get result() {
				// @ts-ignore yes it does
				const formatter = new Intl.ListFormat(this.locales, this.options);
				return formatter.format(this.value);
			},
		};
	};
};