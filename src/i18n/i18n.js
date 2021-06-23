import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// import translation catalog
import translationEs from './translation-es.json';
import translationEn from './translation-en.json';

import config from '../configuration';

const resources = {
    es: {
        translation: translationEs
    },
    en: {
        translation: translationEn
    }
}

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: config.language.default || 'en',
        keySeparator: false, // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;