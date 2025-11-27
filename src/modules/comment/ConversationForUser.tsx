import { useConversation } from '../common/useConversation';
import Conversation from './Conversation';

export const ConversationForUser = ({
  accountId,
}: Readonly<{ accountId: string }>) => {
  const { comments, isLoading, chatbotPrompt } = useConversation({ accountId });

  return (
    <Conversation
      isLoading={isLoading}
      comments={comments ?? []}
      threadSx={{ overflow: 'auto', height: '100%' }}
      chatbotPrompt={chatbotPrompt}
    />
  );
};
