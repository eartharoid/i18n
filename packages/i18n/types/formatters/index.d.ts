export interface ListFormatter {
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
	get result(): string;
}

export function ListFormat(locales: Intl.Locale[]): ListFormatter