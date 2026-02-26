import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Skeleton, Stack, Typography } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';

import { ArrowLeftIcon } from 'lucide-react';

import { ChatbotContainer } from '../comment/ChatbotContainer';
import Conversation from '../comment/Conversation';
import { Conversations } from '../comment/Conversations';
import ChatbotAvatar from '../common/ChatbotAvatar';
import { useConversation } from '../common/useConversation';

function PlayerView(): JSX.Element {
  const { t } = useTranslation();
  const { accountId } = useLocalContext();
  // currently selected conversation id
  // null means no conversation is selected
  // the string 'undefined' selects the legacy conversation (no id attached)
  const [selectedConversationId, setSelectedConversationId] = useState<
    null | string
  >(null);
  const { chatbotPrompt, comments, isLoading, suggestions, chatbotAvatar } =
    useConversation({
      accountId,
      showSuggestions: true,
      conversationId: selectedConversationId,
    });

  if (!accountId) {
    return <Typography>{t('SIGN_OUT_ALERT')}</Typography>;
  }

  if (chatbotPrompt && selectedConversationId) {
    return (
      <>
        <Conversation
          mode="write"
          isLoading={isLoading}
          comments={comments}
          chatbotPrompt={chatbotPrompt}
          chatbotAvatar={chatbotAvatar}
          suggestions={suggestions}
          conversationId={selectedConversationId}
        />
        <Stack alignItems="center" mt={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowLeftIcon />}
            onClick={() => {
              setSelectedConversationId(null);
            }}
          >
            {t('Go back to conversations')}
          </Button>
        </Stack>
      </>
    );
  }

  if (chatbotPrompt) {
    const { chatbotName } = chatbotPrompt;
    return (
      <Conversations
        chatbotAvatar={chatbotAvatar}
        chatbotName={chatbotName}
        onSelect={setSelectedConversationId}
      />
    );
  }

  return (
    <ChatbotContainer>
      <Stack mx={2} alignItems="center">
        <ChatbotAvatar isLoading />
        <Skeleton height={50} width="100%" />
        <Skeleton height={300} width="100%" />
      </Stack>
    </ChatbotContainer>
  );
}
export default PlayerView;
