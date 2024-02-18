import { readFileSync } from 'fs';
import Benchmarkify from 'benchmarkify';
import { I18n } from '@eartharoid/i18n';
import I18n1 from 'i18n1';
import { ctom } from '@eartharoid/cif';

const txt = {
	cif: readFileSync('./samples/test.cif', 'utf8'),
	i18n_json: readFileSync('./samples/test.i18n.json', 'utf8'),
	json: readFileSync('./samples/test.json', 'utf8'),
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

benchmark.createSuite('Parsing & loading', { time: 10e3, description: 'How long does it take to parse the file and load the messages?' })

	.setup(async () => {
		i18n = new I18n();
		i18n_deferred = new I18n({ defer_parsing: true });
		i18next = await import('i18next');
	})

	.ref('JSON', () => {
		const json = JSON.parse(txt.json);
		i18n.load('test', json);
	})

	.add('JSON, deferred', () => {
		const json = JSON.parse(txt.json);
		i18n_deferred.load('test', json);
	})

	.add('I18n JSON', () => {
		const json = JSON.parse(txt.i18n_json);
		i18n.loadParsed('test', Object.entries(json));
	})

	.add('I18n CIF', () => {
		const json = ctom(txt.cif);
		i18n.loadParsed('test', json);
	})


	.add('i18next', () => {
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

benchmark.createSuite('Translating', { description: 'Getting messages & interpolating placeholders' })
	.setup(async () => {
		i18n = new I18n();
		i18n.load('test', parsed.json);
		i18n_deferred = new I18n({ defer_parsing: true });
		i18n_deferred.load('test', parsed.json);
		i18n1 = new I18n1('test', {
			test: parsed.json
		});
		i18next = await import('i18next');
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
		i18n.t('test', 'commands.user.create.sent.description', { user: 'Bob', category: 'Earth' });
	})

	.add('i18n, deferred', () => {
		i18n_deferred.t('test', 'commands.user.create.sent.description', { user: 'Bob', category: 'Earth' });
	})

	.add('i18n v1', () => {
		i18n1.getMessage('test', 'commands.user.create.sent.description', { user: 'Bob', category: 'Earth' });
	})

	.add('i18next', () => {
		i18next.t('commands.user.create.sent.description', { user: 'Bob', category: 'Earth' });
	});

benchmark.run();