import { ChatbotPromptSettings, SettingsKeys } from '@/config/appSetting';
import { hooks } from '@/config/queryClient';

export const useChatbotPrompt = () => {
  const { data: chatbotPromptSettings, isLoading } =
    hooks.useAppSettings<ChatbotPromptSettings>({
      name: SettingsKeys.ChatbotPrompt,
    });

  const chatbotPrompt = chatbotPromptSettings?.[0]?.data;

  return { data: chatbotPrompt, isLoading };
};
