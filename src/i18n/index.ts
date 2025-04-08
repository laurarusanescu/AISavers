import cze from './locales/cze.json';
import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import hu from './locales/hu.json';
import id from './locales/id.json';
import it from './locales/it.json';
import pl from './locales/pl.json';
import ptbr from './locales/pt-br.json';
import ro from './locales/ro.json';
import ru from './locales/ru.json';
import tr from './locales/tr.json';

import { createI18n } from 'vue-i18n';

const messages = { de, en, tr, it, 'pt-br': ptbr, cze, hu, pl, ru, es, fr, id, ro };

export const availableLocales = Object.keys(messages) as Array<keyof typeof messages>;

// Get browser language or fallback to English
const getBrowserLocale = () => {
  const stored = localStorage.getItem('preferredLocale');
  if (stored && availableLocales.includes(stored as any)) {
    return stored;
  }
  const browserLang = navigator.language.split('-')[0];
  return availableLocales.includes(browserLang as any) ? browserLang : 'en';
};

export const initialLocale = getBrowserLocale() as keyof typeof messages;

const numberFormats = Object.fromEntries(
  availableLocales.map(locale => [
    locale,
    {
      currency: {
        minimumFractionDigits: 0,
        style: 'currency'
      },
      percent: {
        maximumFractionDigits: 0,
        style: 'percent'
      }
    }
  ])
);

export type AvailableLocale = keyof typeof messages;

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: messages as any,
  numberFormats: numberFormats as any
}) as any;

export const changeLocale = async (locale: AvailableLocale, currency?: Intl.NumberFormatOptions) => {
  const numberFormat = {
    currency: {
      minimumFractionDigits: 0,
      style: 'currency',
      ...currency
    },
    percent: {
      maximumFractionDigits: 0,
      style: 'percent'
    }
  };

  document.documentElement.lang = locale;
  i18n.global.setNumberFormat(locale, numberFormat);
  i18n.global.locale.value = locale;
  localStorage.setItem('preferredLocale', locale);
};
