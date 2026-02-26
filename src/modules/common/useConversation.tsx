import { AppDataTypes, CommentData } from '@/config/appData';
import { hooks } from '@/config/queryClient';
import { ANONYMOUS_USER, DEFAULT_BOT_USERNAME } from '@/constants';

import { useChatbotAvatar } from './useChatbotAvatar';
import { useChatbotPrompt } from './useChatbotPrompt';

export type Comment = {
  id: string;
  body: string;
  createdAt: string;
  isBot: boolean;
  username: string;
};

export const useConversation = ({
  accountId,
  showSuggestions,
  conversationId,
}: Readonly<{
  accountId?: string;
  showSuggestions?: boolean;
  conversationId?: string | null;
}>) => {
  const { data: appData, isLoading: isAppDataLoading } =
    hooks.useAppData<CommentData>();
  const { data: chatbotPrompt, isLoading: isChatbotSettingsLoading } =
    useChatbotPrompt();
  const { avatar, isLoading: isAvatarLoading } = useChatbotAvatar();

  const comments =
    appData
      ?.filter(
        (res) =>
          // get comments for given user only
          res.creator?.id === accountId &&
          // get comments for given conversation
          (res.data.conversationId === conversationId ||
            // handle legacy messages
            ('undefined' === conversationId && !res.data.conversationId)),
      )
      ?.toSorted((c1, c2) => (c1.createdAt > c2.createdAt ? 1 : -1))
      ?.map((c) => {
        const isBot = c.type === AppDataTypes.BotComment;
        return {
          id: c.id,
          createdAt: c.createdAt,
          isBot,
          body: c.data.content,
          username: isBot
            ? (chatbotPrompt?.chatbotName ?? DEFAULT_BOT_USERNAME)
            : (c.account.name ?? ANONYMOUS_USER),
        };
      }) ?? [];

  // include cue as comment if there is no comments
  const chatbotCueComment =
    chatbotPrompt?.chatbotCue && 0 === comments.length
      ? [
          {
            id: 'cue',
            isBot: true,
            createdAt: new Date().toISOString(),
            body: chatbotPrompt.chatbotCue,
            username: DEFAULT_BOT_USERNAME,
          },
        ]
      : [];

  return {
    comments: [...chatbotCueComment, ...comments],
    chatbotPrompt,
    chatbotAvatar: avatar,
    isLoading: isAppDataLoading || isChatbotSettingsLoading || isAvatarLoading,
    // get suggestions if we want to show the suggestions and if there are no comments
    suggestions:
      showSuggestions && chatbotPrompt && 0 === comments.length
        ? chatbotPrompt.starterSuggestions
        : [],
  };
};
