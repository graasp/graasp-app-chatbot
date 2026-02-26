import { useConversation } from '../common/useConversation';
import Conversation from './Conversation';

export const ConversationForUser = ({
  accountId,
  conversationId,
}: Readonly<{ accountId: string; conversationId?: string }>) => {
  const { comments, isLoading, chatbotPrompt, chatbotAvatar } = useConversation(
    { accountId, conversationId },
  );

  return (
    <Conversation
      isLoading={isLoading}
      comments={comments ?? []}
      threadSx={{ overflow: 'auto', height: '100%' }}
      chatbotPrompt={chatbotPrompt}
      chatbotAvatar={chatbotAvatar}
    />
  );
};
