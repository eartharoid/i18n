import type { FormatterFactory, FactoryLocaleInserter } from '../types';
interface RelativeTimeFormatFactoryBuilder {
    (value: number, unit: Intl.RelativeTimeFormatUnit, options?: Intl.RelativeTimeFormatOptions): RelativeTimeFormatFactory;
}
interface RelativeTimeFormatFactory extends PseudoSetters, Shortcuts, FormatterFactory {
    locales: Intl.Locale[];
    options: Intl.RelativeTimeFormatOptions;
    value: number;
    unit: Intl.RelativeTimeFormatUnit;
}
interface PseudoSetters {
    numberingSystem(numberingSystem: string): this;
    style(style: 'long' | 'short' | 'narrow'): this;
    numeric(numeric: 'always' | 'auto'): this;
}
interface Shortcuts {
    long(): this;
    short(): this;
    narrow(): this;
    always(): this;
    auto(): this;
}
declare const _default: FactoryLocaleInserter<RelativeTimeFormatFactoryBuilder>;
export default _default;
