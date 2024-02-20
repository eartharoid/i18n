import './style.css';
import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';
import { setupCounter } from './counter.ts';
// @ts-ignore
// import { I18n } from '@eartharoid/vite-plugin-i18n';

// const locales = import.meta.glob('./locales/*.json');
// console.log(locales)



// it won't let me import the plugin's I18n?
import { I18nLite } from '@eartharoid/i18n';
import { ctom } from '@eartharoid/cif';
class I18n extends I18nLite {
  constructor(options) {
    super(options);
  }
  load(module) {
    const { cif, locale_id } = module;
    return this.loadParsed(locale_id, ctom(cif));
  }
}
const i18n = new I18n();



const locale_id ='test';
const test =  import(`./locales/${locale_id}.json`);
console.log(test);
const l = i18n.load(await import(`./locales/${locale_id}.json`))

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>${l.t('welcome', { name: 'world' })}</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);