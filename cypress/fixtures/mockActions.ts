import { AppActionsType } from '@/config/appActions';

import { MEMBERS } from './members';
import { APP_ITEM } from './mockItem';

const baseAction = {
  item: APP_ITEM,
  type: AppActionsType.Reply,
  member: MEMBERS.ANNA,
  id: 'random',
  createdAt: '2020-02-07',
};

export const actions = [
  {
    ...baseAction,
    data: {
      content:
        'Hello, Chatbot! Did you know that elephants are among the most intelligent and socially complex animals on Earth?    ',
    },
  },
  {
    ...baseAction,
    data: {
      content:
        ' Exactly. They have highly developed brains, with a complex network of neurons that enable advanced social behaviors and learning capabilities.',
    },
  },
  {
    ...baseAction,
    data: {
      content:
        'Absolutely. Their strong social structures play a crucial role in their survival and well-being, as they rely on cooperation for tasks like raising calves and finding food.',
    },
  },
  {
    ...baseAction,
    data: {
      content:
        'Thats right. Their long-term memory is essential for navigating vast landscapes and passing down knowledge from one generation to the next.',
    },
  },
];
