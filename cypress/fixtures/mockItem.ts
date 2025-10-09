import type { DiscriminatedItem } from '@graasp/sdk';
import { AppItemFactory } from '@graasp/sdk';

import { MEMBERS } from './members';

const MOCK_SERVER_ITEM = {
  id: '123456789',
  name: 'app-starter-ts-vite',
  description: '',
  path: '',
  type: 'folder',
  extra: { folder: {} },
  settings: {},
  creator: MEMBERS[0],
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toISOString(),
  lang: 'en',
} satisfies DiscriminatedItem;

// oxlint-disable eslint/new-cap
const APP_ITEM = AppItemFactory({ creator: MEMBERS.ANNA });

export { APP_ITEM, MOCK_SERVER_ITEM };
