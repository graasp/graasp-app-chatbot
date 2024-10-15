import { AppAction, AppItemType, Member } from '@graasp/sdk';

import { AppActionsType } from '@/config/appActions';

import { MEMBERS } from './members';
import { APP_ITEM } from './mockItem';

const generateAction = (): {
  item: AppItemType;
  type: 'reply_comment';
  account: Member;
  createdAt: string;
  id: string;
} => ({
  item: APP_ITEM,
  type: AppActionsType.Reply,
  account: MEMBERS.ANNA,
  createdAt: '2020-02-07',
  id: (Math.random() + 1).toString(36).substring(2),
});

export const actions = [
  {
    ...generateAction(),
    data: {
      content:
        'Hello, Chatbot! Did you know that elephants are among the most intelligent and socially complex animals on Earth?    ',
    },
  },
  {
    ...generateAction(),
    data: {
      content:
        ' Exactly. They have highly developed brains, with a complex network of neurons that enable advanced social behaviors and learning capabilities.',
    },
  },
  {
    ...generateAction(),
    data: {
      content:
        'Absolutely. Their strong social structures play a crucial role in their survival and well-being, as they rely on cooperation for tasks like raising calves and finding food.',
    },
  },
  {
    ...generateAction(),
    data: {
      content:
        'Thats right. Their long-term memory is essential for navigating vast landscapes and passing down knowledge from one generation to the next.',
    },
  },
] satisfies AppAction[];
