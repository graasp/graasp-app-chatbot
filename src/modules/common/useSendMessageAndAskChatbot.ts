import { useCallback } from 'react';

import { ChatbotPromptSettings } from '@/config/appSetting';

import { useAskChatbot } from './useAskChatbot';
import { useSendMessage } from './useSendMessage';

/**
 * @returns `send` save a message as app data and save a chatbot reply as app data
 * @returns `isLoading` whether a send is loading
 */
export const useSendMessageAndAskChatbot = ({
  chatbotPrompt,
  onSend,
}: {
  chatbotPrompt: ChatbotPromptSettings;
  onSend?: () => void;
}) => {
  const { generateChatbotAnswer, isLoading: askChatbotLoading } =
    useAskChatbot(chatbotPrompt);
  const { sendMessage, isLoading: sendMessageLoading } =
    useSendMessage(chatbotPrompt);

  const send = useCallback(
    async (newUserComment: string) => {
      if (!chatbotPrompt) {
        throw new Error(
          "unexpected error, chatbot setting is not present, can't sent to API without it",
        );
      }

      try {
        const userMessage = await sendMessage(newUserComment);

        await generateChatbotAnswer(userMessage.id, newUserComment);

        onSend?.();
      } catch (e) {
        console.error(e);
      }
    },
    [chatbotPrompt, generateChatbotAnswer, onSend, sendMessage],
  );

  return { send, isLoading: askChatbotLoading || sendMessageLoading };
};
