import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import type { CardProps } from '@mui/material';
import { Card, CardContent, CardHeader, styled } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { formatDate } from '@graasp/sdk';

import type { CommentAppData } from '@/config/appData';
import { AppDataTypes } from '@/config/appData';
import type { ChatbotPromptSettings } from '@/config/appSetting';
import { ChatbotPromptSettingsKeys, SettingsKeys } from '@/config/appSetting';
import { hooks } from '@/config/queryClient';
import { buildCommentContainerDataCy } from '@/config/selectors';
import { BIG_BORDER_RADIUS, DEFAULT_BOT_USERNAME } from '@/constants';

import ChatbotAvatar from './ChatbotAvatar';
import CommentBody from './CommentBody';
import CustomAvatar from './CustomAvatar';

const CustomCard = styled(Card)<CardProps>({
  borderRadius: BIG_BORDER_RADIUS,
});

type Props = {
  comment: CommentAppData;
};

function Comment({ comment }: Props): JSX.Element {
  const { i18n } = useTranslation();

  const { accountId } = useLocalContext();
  const { data: appContext } = hooks.useAppContext();
  const currentMember = appContext?.members.find((m) => m.id === accountId);
  const { data: chatbotPrompts } = hooks.useAppSettings<ChatbotPromptSettings>({
    name: SettingsKeys.ChatbotPrompt,
  });
  const chatbotPrompt = chatbotPrompts?.[0];
  const commentRef = useRef<HTMLDivElement>(null);

  const isBot = comment.type === AppDataTypes.BotComment;

  return (
    <CustomCard
      data-cy={buildCommentContainerDataCy(comment.id)}
      elevation={0}
      ref={commentRef}
    >
      <CardHeader
        title={
          isBot
            ? (chatbotPrompt?.data[ChatbotPromptSettingsKeys.ChatbotName] ??
              DEFAULT_BOT_USERNAME)
            : currentMember?.name
        }
        subheader={formatDate(comment.updatedAt, { locale: i18n.language })}
        avatar={
          isBot ? <ChatbotAvatar /> : <CustomAvatar member={currentMember} />
        }
      />
      <CardContent sx={{ p: 2, py: 0, '&:last-child': { pb: 0 } }}>
        <CommentBody>{comment.data.content}</CommentBody>
      </CardContent>
    </CustomCard>
  );
}

export default Comment;
