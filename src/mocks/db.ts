import type { Database, LocalContext } from '@graasp/apps-query-client';
import { Item, Member, MemberType, PermissionLevel } from '@graasp/sdk';

import { v4 } from 'uuid';

import { DEFAULT_LOCAL_CONTEXT } from '@/config/context';
import { API_HOST } from '@/config/env';

export const mockContext: LocalContext = {
  apiHost: API_HOST,
  permission: PermissionLevel.Admin,
  context: DEFAULT_LOCAL_CONTEXT,
  itemId: '1234-1234-123456-8123-123456',
  memberId: v4(),
};

export const mockMembers: Member[] = [
  {
    id: mockContext.memberId || v4(),
    name: 'ID-123',
    email: '',
    extra: {},
    type: MemberType.Individual,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const buildDatabase = (
  appContext: Partial<LocalContext>,
  members?: Member[],
): Database => ({
  appSettings: [
    {
      createdAt: new Date('2023-09-25T14:11:15.440Z'),
      updatedAt: new Date('2023-09-25T14:11:19.737Z'),
      creator: null,
      item: {} as Item,
      data: {
        initialPrompt: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Who won the world series in 2020?' },
          {
            role: 'assistant',
            content: 'The Los Angeles Dodgers won the World Series in 2020.',
          },
          { role: 'user', content: 'Where was it played?' },
        ],
        chatbotPrompt: 'hello',
      },
      name: 'CHATBOT_PROMPT_SETTINGS',
      id: '1',
    },
  ],
  appData: [],
  appActions: [],
  members: members ?? mockMembers,
  items: [{ id: '1234-1234-123456-8123-123456' } as Item],
});

export default buildDatabase;
