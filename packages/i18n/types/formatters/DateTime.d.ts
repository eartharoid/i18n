import type { FormatterFactory, FactoryLocaleInserter } from '../types';
interface DateTimeFormatFactoryBuilder {
    (value?: Date | Date[], options?: Intl.DateTimeFormatOptions): DateTimeFormatFactory;
}
interface DateTimeFormatFactory extends PseudoSetters, Shortcuts, Modifiers, FormatterFactory {
    locales: Intl.Locale[];
    options: Intl.DateTimeFormatOptions;
    value?: Date | Date[];
    styleModifier?: 'dateStyle' | 'timeStyle';
}
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
    date(): this;
    time(): this;
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
declare const _default: FactoryLocaleInserter<DateTimeFormatFactoryBuilder>;
export default _default;
