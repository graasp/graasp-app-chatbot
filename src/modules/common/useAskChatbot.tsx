import { useCallback } from 'react';

import { ChatbotThreadMessage, buildPrompt } from '@graasp/apps-query-client';

import { AppActionsType } from '@/config/appActions';
import { AppDataTypes, CommentData } from '@/config/appData';
import { ChatbotPromptSettings } from '@/config/appSetting';
import { hooks, mutations } from '@/config/queryClient';

/**
 * Returns a function that save a chatbot answer based on the user message
 * @param chatbotPrompt settings of the chatbot with cue and initial prompt
 * @returns generateChatbotAnswer function
 */
export const useAskChatbot = ({
  chatbotPrompt,
  conversationId,
}: {
  chatbotPrompt: ChatbotPromptSettings;
  conversationId?: string;
}) => {
  const { mutateAsync: postAppDataAsync, isLoading: isPostAppDataLoading } =
    mutations.usePostAppData();

  const { mutateAsync: postChatBotAsync, isLoading: isPostChatbotLoading } =
    mutations.usePostChatBot();
  const { mutate: postAction } = mutations.usePostAppAction();

  const { data: allComments } = hooks.useAppData<CommentData>();
  const conversationComments = allComments
    ?.filter(
      (c) =>
        c.data.conversationId === conversationId ||
        ('undefined' === conversationId && !c.data.conversationId),
    )
    ?.toSorted((c1, c2) => (c1.createdAt > c2.createdAt ? 1 : -1));

  const generateChatbotAnswer = useCallback(
    async (userMessageId: string, newUserComment: string) => {
      // When there are stored messages, use them as the full thread history
      // (the closure captures conversationComments from the render before sendMessage ran,
      // so it excludes the just-saved user message which buildPrompt appends itself).
      // On the very first message the list is empty, so fall back to the cue.
      const threadMessages: ChatbotThreadMessage[] =
        (conversationComments?.length ?? 0) > 0
          ? conversationComments!.map((c) => ({
              botDataType: AppDataTypes.BotComment,
              msgType: c.type,
              data: c.data.content,
            }))
          : [
              {
                botDataType: AppDataTypes.BotComment,
                msgType: AppDataTypes.BotComment,
                data: chatbotPrompt.chatbotCue,
              },
            ];

      const prompt = buildPrompt(
        chatbotPrompt.initialPrompt,
        threadMessages,
        newUserComment,
      );

      try {
        const chatBotRes = await postChatBotAsync(prompt);

        // post comment from bot
        await postAppDataAsync({
          data: {
            parent: userMessageId,
            content: chatBotRes.completion,
            conversationId,
          },
          type: AppDataTypes.BotComment,
        });

        // save action for asking the chatbot
        postAction({
          data: { prompt, userMessageId, conversationId },
          type: AppActionsType.AskChatbot,
        });
      } catch (e) {
        console.error(e);
      }
    },
    [
      conversationComments,
      chatbotPrompt.chatbotCue,
      chatbotPrompt.initialPrompt,
      postAction,
      postAppDataAsync,
      postChatBotAsync,
      conversationId,
    ],
  );

  return {
    generateChatbotAnswer,
    isLoading: isPostChatbotLoading || isPostAppDataLoading,
  };
};
