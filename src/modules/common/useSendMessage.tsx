import { useCallback } from 'react';

import { AppActionsType } from '@/config/appActions';
import { AppDataTypes, CommentData } from '@/config/appData';
import { hooks, mutations } from '@/config/queryClient';

/**
 * Create a function that save an app data with the user message
 * @returns sendMessage function
 */
export const useSendMessage = ({ chatbotCue }: { chatbotCue?: string }) => {
  const { data: comments } = hooks.useAppData<CommentData>();
  const { mutateAsync: postAppDataAsync, isLoading } =
    mutations.usePostAppData();
  const { mutateAsync: postAppActionAsync } = mutations.usePostAppAction();

  const sendMessage = useCallback(
    async (newUserComment: string) => {
      // save cue on first comment
      if (chatbotCue && 0 === comments?.length) {
        await postAppDataAsync({
          data: {
            content: chatbotCue,
          },
          type: AppDataTypes.BotComment,
        });
      }

      const userMessage = await postAppDataAsync({
        data: {
          content: newUserComment,
        },
        type: AppDataTypes.UserComment,
      });

      await postAppActionAsync({
        type: AppActionsType.Reply,
        data: { content: newUserComment },
      });

      return userMessage;
    },
    [comments?.length, chatbotCue, postAppDataAsync, postAppActionAsync],
  );

  return { sendMessage, isLoading };
};
