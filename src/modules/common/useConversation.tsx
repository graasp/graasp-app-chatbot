import { AppDataTypes, CommentData } from '@/config/appData';
import { ChatbotPromptSettings, SettingsKeys } from '@/config/appSetting';
import { hooks } from '@/config/queryClient';
import { ANONYMOUS_USER, DEFAULT_BOT_USERNAME } from '@/constants';

import { useChatbotAvatar } from './useChatbotAvatar';

export type Comment = {
  id: string;
  body: string;
  createdAt: string;
  isBot: boolean;
  username: string;
};

export const useConversation = (accountId?: string) => {
  const { data: appData, isLoading: isAppDataLoading } =
    hooks.useAppData<CommentData>();
  const { data: chatbotPromptSettings, isLoading: isChatbotSettingsLoading } =
    hooks.useAppSettings<ChatbotPromptSettings>({
      name: SettingsKeys.ChatbotPrompt,
    });
  const { avatar, isLoading: isAvatarLoading } = useChatbotAvatar();

  const chatbotPrompt = chatbotPromptSettings?.[0]?.data;

  // get comments for given user only
  const comments =
    appData
      ?.filter((res) => res.creator?.id === accountId)
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
  };
};
