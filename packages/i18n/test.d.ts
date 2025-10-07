import type { NamedArg } from './types';

declare module 'fast-i18n' {

	// function t(locale: string): string
	// ! Translator<"en">

	export function t(key: 'simple'): string
	export function t(key: 'ordinal.position', args: { position: number }): string
	export function t(key: 'travel', args: { list: NamedArg }): string
}