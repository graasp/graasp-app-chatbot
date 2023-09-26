import { AppData } from '@graasp/sdk';

import { List } from 'immutable';

export const buildCodeRowKey = (
  line: { content: string }[],
  index: number,
): string => `row #${index} ${line.map((l) => l.content).join(' ')}`;

export const sortAppDataFromNewest = <T extends AppData>(
  appData: List<T>,
): List<T> => appData.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
