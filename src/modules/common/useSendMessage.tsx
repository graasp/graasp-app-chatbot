import { useCallback } from 'react';

import { AppDataTypes } from '@/config/appData';
import { mutations } from '@/config/queryClient';

/**
 * Create a function that save an app data with the user message
 * @returns sendMessage function
 */
export const useSendMessage = () => {
  const { mutateAsync: postAppDataAsync, isLoading } =
    mutations.usePostAppData();

  const sendMessage = useCallback(
    async (newUserComment: string) => {
      // post new user comment as appData with normal call
      const userMessage = await postAppDataAsync({
        data: {
          content: newUserComment,
        },
        type: AppDataTypes.UserComment,
      });

      return userMessage;
    },
    [postAppDataAsync],
  );

  return { sendMessage, isLoading };
};
