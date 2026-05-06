import { useCallback } from 'react';

import { AppActionsType } from '@/config/appActions';
import { CommentData } from '@/config/appData';
import { hooks, mutations } from '@/config/queryClient';

export const useDeleteConversation = () => {
  const { data: appData } = hooks.useAppData<CommentData>();
  const { mutateAsync: deleteAppDataAsync } = mutations.useDeleteAppData();
  const { mutateAsync: postAppActionAsync } = mutations.usePostAppAction();

  const deleteConversation = useCallback(
    async (conversationId: string) => {
      const conversationMessages =
        appData?.filter(
          (d) =>
            d.data.conversationId === conversationId ||
            ('undefined' === conversationId && !d.data.conversationId),
        ) ?? [];

      await Promise.all(
        conversationMessages.map((msg) => deleteAppDataAsync({ id: msg.id })),
      );

      await postAppActionAsync({
        type: AppActionsType.DeleteConversation,
        data: { conversationId },
      });
    },
    [appData, deleteAppDataAsync, postAppActionAsync],
  );

  return { deleteConversation };
};
