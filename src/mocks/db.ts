import type { Database, LocalContext, Member } from '@graasp/apps-query-client';

import { v4 } from 'uuid';

import { DEFAULT_LOCAL_CONTEXT } from '@/config/context';
import { API_HOST } from '@/config/env';

export const mockContext: LocalContext = {
  apiHost: API_HOST,
  permission: 'admin',
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
  },
];

const buildDatabase = (
  appContext: Partial<LocalContext>,
  members?: Member[],
): Database => ({
  appSettings: [
    {
      createdAt: '2023-09-25T14:11:15.440Z',
      updatedAt: '2023-09-25T14:11:19.737Z',
      itemId: '1234-1234-123456-8123-123456',
      creator: '3b2c3ade-d2c6-4497-8e89-f443d144d3e4',
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
});

export default buildDatabase;
