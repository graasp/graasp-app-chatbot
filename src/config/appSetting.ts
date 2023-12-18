export const SettingsKeys = {
  ChatbotPrompt: 'chatbot-prompt',
  General: 'general',
} as const;

export type ChatCompletionMessageRoles = 'system' | 'user' | 'assistant';

export type ChatCompletionMessage = {
  role: ChatCompletionMessageRoles;
  content: string;
};

// Chatbot Prompt Setting keys
export enum ChatbotPromptSettingsKeys {
  InitialPrompt = 'initialPrompt',
  ChatbotCue = 'chatbotCue',
  ChatbotName = 'chatbotName',
}

export type ChatbotPromptSettings = {
  [ChatbotPromptSettingsKeys.InitialPrompt]: ChatCompletionMessage[];
  [ChatbotPromptSettingsKeys.ChatbotCue]: string;
  [ChatbotPromptSettingsKeys.ChatbotName]: string;

  // used to allow access using settings[settingKey] syntax
  // [key: string]: unknown;
};

// Chatbot Prompt Setting keys
export enum GeneralSettingsKeys {
  MaxCommentLength = 'maxCommentLength',
}

export type GeneralSettings = {
  [GeneralSettingsKeys.MaxCommentLength]: number;
};
