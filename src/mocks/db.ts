import type { Database, LocalContext } from '@graasp/apps-query-client';
import { Member, PermissionLevel } from '@graasp/sdk';

import { v4 } from 'uuid';

// import { APP_DATA_TYPES } from '@/config/appDataTypes';
import { API_HOST } from '@/config/env';

export const mockContext: LocalContext = {
  apiHost: API_HOST,
  permission: PermissionLevel.Admin,
  context: 'player',
  itemId: '1234-1234-123456-8123-123456',
  memberId: v4(),
};

export const mockMembers: Member[] = [
  {
    id: mockContext.memberId || '',
    name: 'current-member',
    email: '',
    extra: {},
    type: 'individual',
    createdAt: new Date('1996-09-08T19:00:00'),
    updatedAt: new Date(),
  },
  {
    id: 'mock-member-id-2',
    name: 'mock-member-2',
    email: '',
    extra: {},
    type: 'individual',
    createdAt: new Date('1995-02-02T15:00:00'),
    updatedAt: new Date(),
  },
];

// const commentBot = v4();
// const commentParent = v4();

const buildDatabase = (
  appContext: Partial<LocalContext>,
  members?: Member[],
): Database => ({
  appData: [
    // {
    //   id: commentBot,
    //   data: {
    //     content: 'This would be thee bot comment',
    //     parent: null,
    //     chatbotPromptSettingId: 'rubbish',
    //   },
    //   memberId: 'mock-member-id',
    //   type: APP_DATA_TYPES.BOT_COMMENT,
    //   itemId: appContext.itemId || '',
    //   visibility: 'member',
    //   creator: 'mock-member-id',
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // },
    // {
    //   id: commentParent,
    //   data: {
    //     content: '*Hello* this is a _comment_ on line 3',
    //     parent: commentBot,
    //   },
    //   memberId: 'mock-member-id',
    //   type: APP_DATA_TYPES.COMMENT,
    //   itemId: appContext.itemId || '',
    //   visibility: 'member',
    //   creator: 'mock-member-id',
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // },
    // {
    //   id: v4(),
    //   data: {
    //     content: '*Hello* this is a _response_ on line 3',
    //     parent: commentParent,
    //   },
    //   memberId: 'mock-member-id',
    //   type: APP_DATA_TYPES.COMMENT,
    //   itemId: appContext.itemId || '',
    //   creator: 'mock-member-id',
    //   visibility: 'member',
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // },
  ],
  appActions: [],
  members: members ?? mockMembers,
  appSettings: [],
  items: [
    {
      id: mockContext.itemId,
      name: 'app-starter-ts-vite',
      description: null,
      path: '',
      settings: {},
      creator: mockMembers[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
});

export default buildDatabase;
