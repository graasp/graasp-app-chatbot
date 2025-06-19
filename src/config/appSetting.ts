import { ChatBotMessage } from '@graasp/sdk';

export const SettingsKeys = {
  ChatbotPrompt: 'chatbot-prompt',
  General: 'general',
} as const;

export type ChatCompletionMessageRoles = 'system' | 'user' | 'assistant';

// Chatbot Prompt Setting keys
export const ChatbotPromptSettingsKeys = {
  InitialPrompt: 'initialPrompt',
  ChatbotCue: 'chatbotCue',
  ChatbotName: 'chatbotName',
  GptVersion: 'gptVersion',
} as const;

export type ChatbotPromptSettings = {
  [ChatbotPromptSettingsKeys.InitialPrompt]: ChatBotMessage[];
  [ChatbotPromptSettingsKeys.ChatbotCue]: string;
  [ChatbotPromptSettingsKeys.ChatbotName]: string;
  [ChatbotPromptSettingsKeys.GptVersion]?: string;
  // used to allow access using settings[settingKey] syntax
  // [key: string]: unknown;
};

// Chatbot Prompt Setting keys
export const GeneralSettingsKeys = {
  MaxCommentLength: 'maxCommentLength',
  MaxThreadLength: 'maxThreadLength',
} as const;

export type GeneralSettings = {
  [GeneralSettingsKeys.MaxCommentLength]: number;
  [GeneralSettingsKeys.MaxThreadLength]: number;
};
export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  [GeneralSettingsKeys.MaxCommentLength]: 300,
  [GeneralSettingsKeys.MaxThreadLength]: 50,
};
