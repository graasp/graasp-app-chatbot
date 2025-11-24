import { Typography } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';

import Conversation from '../comment/Conversation';
import { useConversation } from '../common/useConversation';

function PlayerView(): JSX.Element {
  const { accountId } = useLocalContext();
  const { chatbotPrompt, comments, isLoading } = useConversation(accountId);

  if (!accountId) {
    return <Typography>You should be signed in</Typography>;
  }

  return (
    <Conversation
      isLoading={isLoading}
      comments={comments}
      chatbotPrompt={chatbotPrompt}
    />
  );
}
export default PlayerView;
