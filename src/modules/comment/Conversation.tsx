import { useTranslation } from 'react-i18next';

import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Stack,
  SxProps,
  Theme,
} from '@mui/material';

import { ChatbotPromptSettings } from '@/config/appSetting';
import { DEFAULT_BOT_USERNAME } from '@/constants';

import CommentEditor from '../common/CommentEditor';
import CommentThread from '../common/CommentThread';
import { Comment } from '../common/useConversation';
import ChatbotHeader from './ChatbotHeader';
import CommentContainer from './CommentContainer';

function Conversation({
  threadSx,
  comments,
  chatbotPrompt,
  isLoading,
}: Readonly<{
  chatbotPrompt?: ChatbotPromptSettings;
  threadSx?: SxProps<Theme>;
  isLoading?: boolean;
  comments: Comment[];
}>) {
  const { t } = useTranslation();

  if (chatbotPrompt) {
    const { chatbotCue, chatbotName } = chatbotPrompt;

    // construct cue message if there is no messages yet
    let commentsToShow = comments;
    if (0 === comments.length) {
      commentsToShow = [
        {
          id: 'cue',
          isBot: true,
          createdAt: new Date().toISOString(),
          body: chatbotCue,
          username: DEFAULT_BOT_USERNAME,
        },
      ];
    }

    return (
      <Box
        sx={{
          px: { xs: 2, sm: 10 },
          maxWidth: '100ch',
          m: 'auto',
          height: '100%',
        }}
      >
        <CommentContainer>
          <Stack gap={3} px={2}>
            <ChatbotHeader name={chatbotName} />
            <Divider />
            <CommentThread threadSx={threadSx} comments={commentsToShow} />
            <CommentEditor chatbotPrompt={chatbotPrompt} />
          </Stack>
        </CommentContainer>
      </Box>
    );
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  return <Alert severity="warning">{t('CHATBOT_CONFIGURATION_MISSING')}</Alert>;
}

export default Conversation;
