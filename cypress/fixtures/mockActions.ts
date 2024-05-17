import { AppActionsType } from '@/config/appActions';

import { MEMBERS } from './members';
import { APP_ITEM } from './mockItem';

const baseAction = {
  item: APP_ITEM,
  type: AppActionsType.Reply,
  member: MEMBERS.ANNA,
  createdAt: '2020-02-07',
};

export const actions = [
  {
    ...baseAction,
    id: (Math.random() + 1).toString(36).substring(2),
    data: {
      content:
        'Hello, Chatbot! Did you know that elephants are among the most intelligent and socially complex animals on Earth?    ',
    },
  },
  {
    ...baseAction,
    id: (Math.random() + 1).toString(36).substring(2),
    data: {
      content:
        ' Exactly. They have highly developed brains, with a complex network of neurons that enable advanced social behaviors and learning capabilities.',
    },
  },
  {
    ...baseAction,
    id: (Math.random() + 1).toString(36).substring(2),

    data: {
      content:
        'Absolutely. Their strong social structures play a crucial role in their survival and well-being, as they rely on cooperation for tasks like raising calves and finding food.',
    },
  },
  {
    ...baseAction,
    id: (Math.random() + 1).toString(36).substring(2),
    data: {
      content:
        'Thats right. Their long-term memory is essential for navigating vast landscapes and passing down knowledge from one generation to the next.',
    },
  },
];
