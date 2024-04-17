import type { FormatterFactory, FactoryLocaleInserter } from '../types';
interface ListFormatFactoryBuilder {
    (value: string[]): ListFormatFactory;
}
interface ListFormatFactory extends FormatterFactory {
    locales: Intl.Locale[];
    options: {
        type?: 'conjunction' | 'disjunction' | 'unit';
        style?: 'long' | 'short' | 'narrow';
    };
    type(type: 'conjunction' | 'disjunction' | 'unit'): this;
    style(style: 'long' | 'short' | 'narrow'): this;
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
declare const _default: FactoryLocaleInserter<ListFormatFactoryBuilder>;
export default _default;
