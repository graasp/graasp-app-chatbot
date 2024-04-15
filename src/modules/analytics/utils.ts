import { AppAction } from '@graasp/sdk';

import countBy from 'lodash.countby';
import flatten from 'lodash.flatten';
import { ara, deu, eng, fra, ita, removeStopwords, spa } from 'stopword';

import { CommentData } from '@/config/appData';
import { DEFAULT_LANGUAGE } from '@/config/i18n';

type WordCount = { [key: string]: number };

export const getTopRepetitiveWords = (obj: WordCount, n: number): WordCount => {
  // Convert the object into an array of [key, value] pairs
  const entries = Object.entries(obj);

  entries.sort((a, b) => b[1] - a[1]);

  const topNEntries = entries.slice(0, n);
  const topNObj = Object.fromEntries(topNEntries);

  return topNObj;
};

const languages: { [key: string]: string[] } = {
  en: eng,
  fr: fra,
  de: deu,
  es: spa,
  it: ita,
  ar: ara,
};

export const getAllWords = (
  texts: AppAction<CommentData>[],
  lang = DEFAULT_LANGUAGE,
): WordCount => {
  const text = texts
    .reduce((curr: string, acc) => `${curr} ${acc.data.content}`, '')
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    ?.split(/[\s\n]+|\b/);

  const words = removeStopwords(text, [...languages[lang], '', '?', "'", '"']);
  const b = flatten(words);
  const c = countBy(b);
  return c;
};

export const createRegexFromString = (regexString: string): RegExp | string => {
  // Extract between the slashes and the flags
  const matches = regexString.match(/\/(.*)\/([a-z]*)?/);
  if (!matches) {
    return regexString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const pattern = matches[1];
  const flags = matches[2];
  return new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
};
