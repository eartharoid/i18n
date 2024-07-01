const i18n = new I18nLite();
i18n.loadParsed(
	'en-GB',
	ctom(
		await fetch(`${window.location.origin}/en-GB/_common.cif`)
	),
	'common',
);



// new CIFLoader(i18n, 'modular') // mono | modular
// = 
const cif1 = new CIFLoader(i18n, {
	id_regex: /((?<locale>[a-z0-9-_]+)\/)((_(?<namespace>[a-z0-9-_]+))|[a-z0-9-_]+)\.[a-z]+/i,
	fetch: (path) => fetch(window.location.origin + path)
});
cif1.load('/en-GB/home.cif');
cif1.load('/en-GB/_common.cif');


const cif2 = new CIFLoader(i18n, {
	regex: /a/i,
	fetch: (name) => fetch(`${window.location.origin}/${locale}/${name}.cif`)
});

cif2.load('en-GB', ['home#page', '#common'])

async function* foo() {
	yield await Promise.resolve('a');
	yield await Promise.resolve('b');
	yield await Promise.resolve('c');
}

let str = '';

async function generate() {
	for await (const val of foo()) {
		str = str + val;
	}
	console.log(str);
}

generate();

res = await fetch("https://static.eartharoid.me/test.cif?t34");
i = 0;
// reader = res.body.getReader()
reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
try {
	while (true) {
		const { done, value } = await reader.read();
		console.log(i++, value);
		if (done) break;
	}
} finally {
	reader.releaseLock();
}