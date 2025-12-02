import { useTranslation } from 'react-i18next';

import { Alert, Box, CircularProgress } from '@mui/material';

import { ChatbotPromptSettings } from '@/config/appSetting';

import { Comment } from '../common/useConversation';
import { CommentContainer, CommentContainerProps } from './CommentContainer';

function Conversation({
  threadSx,
  comments,
  chatbotPrompt,
  chatbotAvatar,
  isLoading,
  mode = 'read',
  suggestions,
}: Readonly<{
  chatbotAvatar?: Blob;
  chatbotPrompt?: ChatbotPromptSettings;
  comments: Comment[];
  isLoading?: boolean;
  mode?: CommentContainerProps['mode'];
  suggestions?: string[];
  threadSx?: CommentContainerProps['threadSx'];
}>) {
  const { t } = useTranslation();

  if (chatbotPrompt) {
    const { chatbotName } = chatbotPrompt;

    return (
      <Box
        sx={{
          px: { xs: 2, sm: 10 },
          maxWidth: '100ch',
          m: 'auto',
          height: '100%',
        }}
      >
        <CommentContainer
          chatbotAvatar={chatbotAvatar}
          chatbotName={chatbotName}
          threadSx={threadSx}
          comments={comments}
          chatbotPrompt={chatbotPrompt}
          mode={mode}
          suggestions={suggestions}
        />
      </Box>
    );
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  return <Alert severity="warning">{t('CHATBOT_CONFIGURATION_MISSING')}</Alert>;
}

export default Conversation;
