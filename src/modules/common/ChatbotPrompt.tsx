import { useTranslation } from 'react-i18next';

import { Alert, CardContent, CardHeader } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import type { UUID } from '@graasp/sdk';

import type { CommentData } from '@/config/appData';
import type { ChatbotPromptSettings } from '@/config/appSetting';
import { SettingsKeys } from '@/config/appSetting';
import { hooks } from '@/config/queryClient';
import { buildChatbotPromptContainerDataCy } from '@/config/selectors';
import { DEFAULT_BOT_USERNAME } from '@/constants';

import CustomCommentCard from '../comment/CustomCommentCard';
import ChatbotAvatar from './ChatbotAvatar';
import CommentBody from './CommentBody';

type Props = {
  id?: UUID;
};

function ChatbotPrompt({ id }: Props): JSX.Element | null {
  const { t } = useTranslation();
  const { data: appData } = hooks.useAppData<CommentData>();
  const {
    data: chatbotPrompts,
    isSuccess,
    isError,
  } = hooks.useAppSettings<ChatbotPromptSettings>({
    name: SettingsKeys.ChatbotPrompt,
  });
  const chatbotPrompt = chatbotPrompts?.[0];

  const { accountId } = useLocalContext();

  const comments = appData?.filter((c) => c.creator?.id === (id ?? accountId));

  const realChatbotPromptExists = comments?.find(
    (c) => c.data.chatbotPromptSettingId !== undefined,
  );

  if (!chatbotPrompt) {
    if (isSuccess) {
      return (
        <Alert severity="warning">{t('CHATBOT_CONFIGURATION_MISSING')}</Alert>
      );
    }
    if (isError) {
      return (
        <Alert severity="error">{t('CHATBOT_CONFIGURATION_FETCH_ERROR')}</Alert>
      );
    }
    // do not show anything if it has not finished fetching
    return null; // oxlint-disable-line eslint-plugin-unicorn/no-null
  }
  const chatbotName = chatbotPrompt?.data?.chatbotName || DEFAULT_BOT_USERNAME;

  // display only if real chatbot prompt does not exist yet
  if (!realChatbotPromptExists) {
    if ('' === chatbotPrompt?.data?.chatbotCue) {
      return <>Please configure the chatbot prompt.</>;
    }
    return (
      <>
        <CustomCommentCard
          elevation={0}
          data-cy={buildChatbotPromptContainerDataCy(chatbotPrompt.id)}
        >
          <CardHeader
            title={chatbotName}
            subheader={t('JUST_NOW_COMMENT_HEADER')}
            avatar={<ChatbotAvatar />}
          />
          <CardContent sx={{ p: 2, py: 0, '&:last-child': { pb: 0 } }}>
            <CommentBody>{chatbotPrompt?.data?.chatbotCue}</CommentBody>
          </CardContent>
        </CustomCommentCard>
      </>
    );
  }
  return null;
}

export default ChatbotPrompt;
