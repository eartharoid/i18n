const I18n = require('../lib');
const i18n = new I18n('test/locales', 'en-GB');

const en = i18n.get(); 
const fr = i18n.get('fr-FR'); 

console.log('en', en('hello'));
console.log('fr', fr('hello'));

console.log('en', en('hello_name', 'Isaac'));
console.log('fr', fr('hello_name', 'Isaac'));

console.log('en', en('other.age', 1));
console.log('en', en('other.age', 21));
console.log('fr', fr('other.age', 1));
console.log('fr', fr('other.age', 21));