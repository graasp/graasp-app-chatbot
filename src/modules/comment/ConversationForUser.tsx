import { useChatbotAvatar } from '../common/useChatbotAvatar';
import { useConversation } from '../common/useConversation';
import Conversation from './Conversation';

export const ConversationForUser = ({
  userId,
}: Readonly<{ userId: string }>) => {
  const { comments, isLoading, chatbotPrompt } = useConversation(userId);
  const { avatar } = useChatbotAvatar();

  return (
    <Conversation
      isLoading={isLoading}
      comments={comments ?? []}
      threadSx={{ overflow: 'auto', height: '100%' }}
      chatbotPrompt={chatbotPrompt}
      chatbotAvatar={avatar}
    />
  );
};
