import { useCallback } from 'react';

import { AppActionsType } from '@/config/appActions';
import { AppDataTypes } from '@/config/appData';
import { mutations } from '@/config/queryClient';

/**
 * Create a function that save an app data with the user message
 * @returns sendMessage function
 */
export const useSendMessage = () => {
  const { mutateAsync: postAppDataAsync, isLoading } =
    mutations.usePostAppData();
  const { mutateAsync: postAppActionAsync } = mutations.usePostAppAction();

  const sendMessage = useCallback(
    async (newUserComment: string) => {
      // post new user comment as appData with normal call
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
    [postAppDataAsync, postAppActionAsync],
  );

  return { sendMessage, isLoading };
};
