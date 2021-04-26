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
		public default_locale: string;
		public readonly locales: string[];
		private readonly messages: Locales;

		public getLocale: (
			locale: string | undefined
		) => Messages;

		public getMessage: (
			locale: string | undefined,
			message: string,
			...args: MessageArgs
		) => string | undefined;

		private resolve: (
			obj: Messages | MessageArgs | NamedArgs,
			key: string
		) => string | string[] | undefined;
	}

	export default I18n;
}