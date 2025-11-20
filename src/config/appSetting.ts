import type { ChatBotMessage } from '@graasp/sdk';

export const SettingsKeys = {
  ChatbotPrompt: 'chatbot-prompt',
} as const;

export type ChatCompletionMessageRoles = 'system' | 'user' | 'assistant';

// Chatbot Prompt Setting keys
export const ChatbotPromptSettingsKeys = {
  InitialPrompt: 'initialPrompt',
  ChatbotCue: 'chatbotCue',
  ChatbotName: 'chatbotName',
} as const;

export type ChatbotPromptSettings = {
  [ChatbotPromptSettingsKeys.InitialPrompt]: ChatBotMessage[];
  [ChatbotPromptSettingsKeys.ChatbotCue]: string;
  [ChatbotPromptSettingsKeys.ChatbotName]: string;
  // used to allow access using settings[settingKey] syntax
  // [key: string]: unknown;
};

export const DEFAULT_GENERAL_SETTINGS = {
  MaxCommentLength: 300,
  MaxThreadLength: 50,
};
