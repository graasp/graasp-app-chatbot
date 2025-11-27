import { useCallback } from 'react';

import { ChatbotThreadMessage, buildPrompt } from '@graasp/apps-query-client';
import { ChatbotRole } from '@graasp/sdk';

import { AppActionsType } from '@/config/appActions';
import { AppDataTypes } from '@/config/appData';
import { ChatbotPromptSettings } from '@/config/appSetting';
import { mutations } from '@/config/queryClient';

/**
 * Returns a function that save a chatbot answer based on the user message
 * @param chatbotPrompt settings of the chatbot with cue and initial prompt
 * @returns generateChatbotAnswer function
 */
export const useAskChatbot = (chatbotPrompt: ChatbotPromptSettings) => {
  const { mutateAsync: postAppDataAsync, isLoading: isPostAppDataLoading } =
    mutations.usePostAppData();

  const { mutateAsync: postChatBotAsync, isLoading: isPostChatbotLoading } =
    mutations.usePostChatBot();
  const { mutate: postAction } = mutations.usePostAppAction();

  const generateChatbotAnswer = useCallback(
    async (userMessageId: string, newUserComment: string) => {
      const threadMessages: ChatbotThreadMessage[] = [
        {
          botDataType: AppDataTypes.BotComment,
          msgType: AppDataTypes.BotComment,
          data: chatbotPrompt.chatbotCue,
        },
      ];

      const prompt = [
        // this is to spread the JSON setting before the messages
        { role: ChatbotRole.System, content: chatbotPrompt.initialPrompt },
        // this function requests the prompt as the first argument in string format
        // we can not use it in this context as we are using a JSON prompt.
        // if we simplify the prompt in the future we will be able to remove the line above
        // and this function solely
        ...buildPrompt(undefined, threadMessages, newUserComment),
      ];

      try {
        const chatBotRes = await postChatBotAsync(prompt);

        // post comment from bot
        await postAppDataAsync({
          data: {
            parent: userMessageId,
            content: chatBotRes.completion,
          },
          type: AppDataTypes.BotComment,
        });

        // save action for asking the chatbot
        await postAction({
          data: { prompt, userMessageId },
          type: AppActionsType.AskChatbot,
        });
      } catch (e) {
        console.error(e);
      }
    },
    [
      chatbotPrompt.chatbotCue,
      chatbotPrompt.initialPrompt,
      postAction,
      postAppDataAsync,
      postChatBotAsync,
    ],
  );

  return {
    generateChatbotAnswer,
    isLoading: isPostChatbotLoading || isPostAppDataLoading,
  };
};
