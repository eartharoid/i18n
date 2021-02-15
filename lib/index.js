/**
 * @module @eartharoid/i18n
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license MIT
 */

const { join } = require('path');
const fs = require('fs');

const get = (obj, path) => path.split(/\./g).reduce((acc, part) => acc && acc[part], obj); // goodbye lodash

module.exports = class I18n {
	constructor(path, default_locale) {
		if (typeof path !== 'string') throw new TypeError(`Expected path to be a string, got ${typeof path}`);
		if (typeof default_locale !== 'string') throw new TypeError(`Expected default_locale to be a string, got ${typeof default_locale}`);
		
		this.path = path;
		this.default_locale = default_locale;
		this.default_locale_path = join(this.path, this.default_locale + '.json');

		if (!fs.existsSync(this.default_locale_path)) throw new Error('Default locale file does not exist');

		this.defaults = JSON.parse(fs.readFileSync(this.default_locale_path)); // in case a file is missing messages
	}

	get(locale) {
		locale = locale || this.default_locale;

		let locale_path = join(this.path, locale + '.json');

		if (!fs.existsSync(locale_path))
			locale = this.default_locale,
			locale_path = join(this.path, locale + '.json');
		
		let messages = JSON.parse(fs.readFileSync(locale_path));
		
		return (msg, ...args) => {	
			let message = get(messages, msg) || get(this.defaults, msg),
				i = 0;
			if (!message) return undefined; // msg not found
			if (message instanceof Array) message = args[0] === 1 ? message[0] : message[1]; // message is array, make it a string
			else if (typeof message === 'object') throw new Error(`${msg} is an invalid message key, it is an object, not an array or string.`); // message is an object and not an array
			return message.replace(/%(d|s)/g, () => args[i++]);
		};
	}

	get locales() {
		return fs.readdirSync(this.path)
			.filter(file => file.endsWith('.json')) // don't include index.js 
			.map(name => name.slice(0, name.length - 5)); // remove .json from the end so it's just an array of file names without extension
	}
};
