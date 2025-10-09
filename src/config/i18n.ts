import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';

import en from '../langs/en.json';
import fr from '../langs/fr.json';

const DEFAULT_LANGUAGE = 'en';
const defaultNS = 'translations';
const resources = {
  en,
  fr,
} as const;

declare module 'react-i18next' {
  // oxlint-disable-next-line consistent-type-definitions
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)['en'];
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANGUAGE,
  // debug only when not in production
  debug: import.meta.env.DEV,
  ns: [defaultNS],
  defaultNS,
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
  },
  fallbackLng: DEFAULT_LANGUAGE,
});

export default i18n;
export { DEFAULT_LANGUAGE, defaultNS, resources };
