import { ChatbotRole } from '@graasp/sdk';

import { SettingsKeys } from '@/config/appSetting';

import { MOCK_SERVER_ITEM } from './mockItem';

export const MOCK_APP_SETTING = {
  id: 'app-setting-id',
  item: MOCK_SERVER_ITEM,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  name: SettingsKeys.ChatbotPrompt,
  data: {
    chatbotCue: 'cue',
    chatbotName: 'name',
    initialPrompt: [{ role: ChatbotRole.Assistant, content: 'prompt' }],
  },
};
