import { Divider, Stack, SxProps, Theme, styled } from '@mui/material';

import { ChatbotPromptSettings } from '@/config/appSetting';

import { BIG_BORDER_RADIUS } from '../../constants';
import { ChatbotTyping } from '../common/ChatbotTyping';
import CommentEditor from '../common/CommentEditor';
import CommentThread from '../common/CommentThread';
import { Suggestions } from '../common/Suggestions';
import { Comment } from '../common/useConversation';
import { useSendMessageAndAskChatbot } from '../common/useSendMessageAndAskChatbot';
import ChatbotHeader from './ChatbotHeader';

const Container = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  border: 'solid silver 1px',
  padding: theme.spacing(3, 0),
  borderRadius: BIG_BORDER_RADIUS,
}));

export type CommentContainerProps = Readonly<{
  chatbotAvatar?: Blob;
  chatbotName: string;
  chatbotPrompt: ChatbotPromptSettings;
  comments: Comment[];
  mode?: 'read' | 'write';
  suggestions?: string[];
  threadSx?: SxProps<Theme>;
}>;

export function CommentContainer({
  threadSx,
  comments,
  chatbotPrompt,
  chatbotName,
  chatbotAvatar,
  mode = 'read',
  suggestions,
}: CommentContainerProps) {
  const { send, isLoading: isSendingMessageAndAsking } =
    useSendMessageAndAskChatbot({
      chatbotPrompt,
    });

  return (
    <Container>
      <Stack gap={3} px={2}>
        <Stack role="log" gap={3}>
          <ChatbotHeader avatar={chatbotAvatar} name={chatbotName} />
          <Divider />
          <CommentThread
            chatbotAvatar={chatbotAvatar}
            threadSx={threadSx}
            comments={comments}
          />
          {suggestions && <Suggestions suggestions={suggestions} send={send} />}
          {isSendingMessageAndAsking && (
            <ChatbotTyping avatar={chatbotAvatar} />
          )}
        </Stack>
        <Stack>
          {'write' === mode && (
            <CommentEditor send={send} isLoading={isSendingMessageAndAsking} />
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
