// import { readFileSync } from 'fs';
// import Benchmarkify from 'benchmarkify';
// import { I18n } from '@eartharoid/i18n';
// import I18n1 from 'i18n1';
// import { ctom } from '@eartharoid/cif';

(async () => {
	const { readFileSync } = require('fs');
	const Benchmarkify = require('benchmarkify');
	const { I18n } = await import('@eartharoid/i18n');
	const I18n1 = require('i18n1');
	const { ctom } = await import('@eartharoid/cif');

	const txt = {
		cif: readFileSync('./samples/test.cif', 'utf8'),
		i18n_json: readFileSync('./samples/test.i18n.json', 'utf8'),
		json: readFileSync('./samples/test.json', 'utf8'),
		missing_json: readFileSync('./samples/missing.json', 'utf8'),
	};

	const parsed = {
		cif: ctom(txt.cif),
		json: JSON.parse(txt.json),
		i18n_json: JSON.parse(txt.i18n_json),
	};

	let i18n1, i18n, i18n_deferred, i18next;

	const benchmark = new Benchmarkify(
		'@eartharoid/i18n benchmarks',
		{
			chartImage: true,
		}
	).printHeader();

	benchmark.createSuite('Parsing & loading', { time: 3e3, description: 'How long does it take to parse the file and load the messages?' })

		.setup(async () => {
			i18n = new I18n({ defer_extraction: false });
			i18n_deferred = new I18n({
				default_locale_id: 'en',
				defer_extraction: true,
			});
			// i18next = await import('i18next');
			i18next = require('i18next');
			delete require.cache[require.resolve('./samples/missing.js')];
			delete require.cache[require.resolve('./samples/test.js')];
			delete require.cache[require.resolve('./samples/test.i18n.js')];
		})

		.ref('Raw JSON', () => {
			const json = JSON.parse(txt.json);
			i18n.load('en', json);
		})

		.add('Raw JSON, deferred', () => {
			const json = JSON.parse(txt.json);
			i18n_deferred.load('en', json);
		})

		.add('Raw JSON, deferred, w/ fallback', () => {
			i18n_deferred.load('en', JSON.parse(txt.json));
			i18n_deferred.load('en-GB', JSON.parse(txt.missing_json));
			i18n_deferred.fallback();
		})

		.add('Raw JS', () => {
			// const { json } = await import(`./samples/test.js`);
			const json = require(`./samples/test.js`);
			i18n.load('en', json);
		})

		.add('Raw JS, deferred', async () => {
			// const { json } = await import(`./samples/test.js`);
			const json = require(`./samples/test.js`);
			i18n_deferred.load('en', json);
		})

		.add('Raw JS, deferred, w/ fallback', () => {
			i18n_deferred.load('en', require(`./samples/test.js`));
			i18n_deferred.load('en-GB', require(`./samples/missing.js`));
			i18n_deferred.fallback();
		})

		// it's too fast
		// .add('I18n JS', async () => {
		// 	// const { json } = await import(`./samples/test.i18n.js`);
		// 	const json = require(`./samples/test.i18n.js`);
		// 	i18n.loadParsed('test', json);
		// })

		.add('I18n JSON', () => {
			const json = JSON.parse(txt.i18n_json);
			i18n.loadParsed('test', json);
		})

		.add('I18n CIF', () => {
			const json = ctom(txt.cif);
			i18n.loadParsed('test', json);
		})

		.add('i18next JSON', () => {
			const json = JSON.parse(txt.json);
			i18next.init({
				lng: 'en',
				resources: {
					en: {
						translation: json
					},
				},
			});
		});

	benchmark.createSuite('Translating', { time: 5e3, description: 'Getting a message and filling its placeholders' })
		.setup(async () => {
			i18n = new I18n({ defer_extraction: false });
			i18n.load('en', parsed.json);
			i18n_deferred = new I18n({ defer_extraction: true });
			i18n_deferred.load('en', parsed.json);
			i18n1 = new I18n1('en', {
				en: parsed.json
			});
			// i18next = await import('i18next');
			i18next = require('i18next');
			i18next.init({
				lng: 'en',
				resources: {
					en: {
						translation: parsed.json
					},
				},
			});
		})
		.ref('i18n', () => {
			i18n.t('en', 'commands.user.create.sent.description', { user: 'Bob', category: 'Earth' });
		})

		.add('i18n, deferred', () => {
			i18n_deferred.t('en', 'commands.user.create.sent.description', { user: 'Bob', category: 'Earth' });
		})

		.add('i18n v1', () => {
			i18n1.getMessage('en', 'commands.user.create.sent.description', { user: 'Bob', category: 'Earth' });
		})

		.add('i18next', () => {
			i18next.t('commands.user.create.sent.description', { user: 'Bob', category: 'Earth' });
		});

	benchmark.run();
})();