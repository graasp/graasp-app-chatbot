import { useConversation } from '../common/useConversation';
import Conversation from './Conversation';

export const ConversationForUser = ({
  userId,
}: Readonly<{ userId: string }>) => {
  const { comments, isLoading, chatbotPrompt, chatbotAvatar } =
    useConversation(userId);

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
