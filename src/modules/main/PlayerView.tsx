import { useTranslation } from 'react-i18next';

import type { SxProps, Theme } from '@mui/material';
import { Alert, Box } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import type { UUID } from '@graasp/sdk';

import type { CommentData } from '@/config/appData';
import { ChatbotPromptSettings, SettingsKeys } from '@/config/appSetting';
import { hooks } from '@/config/queryClient';
import { PLAYER_VIEW_CY } from '@/config/selectors';
import ChatbotPrompt from '@/modules/common/ChatbotPrompt';
import CommentThread from '@/modules/common/CommentThread';

import CommentContainer from '../comment/CommentContainer';
import CommentEditor from '../common/CommentEditor';

type Props = {
  id?: UUID;
  threadSx?: SxProps<Theme>;
};

function PlayerView({ id, threadSx = {} }: Readonly<Props>) {
  const { t } = useTranslation();
  const { data: appData, isLoading: isAppDataLoading } =
    hooks.useAppData<CommentData>();
  const { data: chatbotPromptSettings, isLoading: isChatbotSettingsLoading } =
    hooks.useAppSettings<ChatbotPromptSettings>({
      name: SettingsKeys.ChatbotPrompt,
    });

  let { accountId } = useLocalContext();
  if (id) {
    accountId = id;
  }

  if (chatbotPromptSettings && 0 < chatbotPromptSettings.length && appData) {
    const comments = appData
      .filter((res) => res.creator?.id === accountId)
      .toSorted((c1, c2) => (c1.createdAt > c2.createdAt ? 1 : -1));

    return (
      <Box
        sx={{
          px: { xs: 2, sm: 10 },
          maxWidth: '100ch',
          m: 'auto',
          height: '100%',
        }}
        data-cy={PLAYER_VIEW_CY}
      >
        <CommentContainer>
          <ChatbotPrompt id={accountId} />
          <CommentThread threadSx={threadSx} comments={comments} />
          <CommentEditor chatbotPrompt={chatbotPromptSettings[0].data} />
        </CommentContainer>
      </Box>
    );
  }

  if (isAppDataLoading || isChatbotSettingsLoading) {
    return 'loading';
  }

  if (!chatbotPromptSettings || 0 === chatbotPromptSettings.length) {
    return (
      <Alert severity="warning">{t('CHATBOT_CONFIGURATION_MISSING')}</Alert>
    );
  }
}
export default PlayerView;
