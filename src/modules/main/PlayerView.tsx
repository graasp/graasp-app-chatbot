import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';

import Conversation from '../comment/Conversation';
import { useConversation } from '../common/useConversation';

function PlayerView(): JSX.Element {
  const { t } = useTranslation();
  const { accountId } = useLocalContext();
  const { chatbotPrompt, comments, isLoading, suggestions, chatbotAvatar } =
    useConversation({
      accountId,
      showSuggestions: true,
    });

  if (!accountId) {
    return <Typography>{t('SIGN_OUT_ALERT')}</Typography>;
  }

  return (
    <Conversation
      mode="write"
      isLoading={isLoading}
      comments={comments}
      chatbotPrompt={chatbotPrompt}
      chatbotAvatar={chatbotAvatar}
      suggestions={suggestions}
    />
  );
}
export default PlayerView;
