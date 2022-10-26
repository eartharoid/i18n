declare module '@eartharoid/i18n' {

	interface NamedArgs {
		[name: string]: string | number
	}

	type MessageArgs = (string | number | NamedArgs)[]

	type Message = string[] | string;

	interface Messages {
		[message: string]: Messages | Message
	}

	interface Locales {
		[locale: string]: Messages
	}

	class I18n {
		constructor(
			default_locale: string,
			locales: Locales
		);

		public default_locale: string;
		public readonly locales: string[];
		private readonly messages: Locales;

		public getAllMessages: (
			message: string,
			...args: MessageArgs
		) => Messages;

		public getLocale: (
			locale?: string
		) => (message: string, ...args: MessageArgs) => string | undefined;

		public getMessage: (
			locale: string | null | undefined,
			message: string,
			...args: MessageArgs
		) => string | undefined;

		public getMessages: (
			locales: string[],
			message: string,
			...args: MessageArgs
		) => Messages;

		private resolve: (
			obj: Messages | MessageArgs | NamedArgs,
			key: string
		) => string | string[] | undefined;
	}

	export default I18n;
}