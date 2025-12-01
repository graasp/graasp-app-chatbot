import { Stack, Typography } from '@mui/material';

import ChatbotAvatar from '../common/ChatbotAvatar';

function ChatbotHeader({
  name,
  avatar,
}: Readonly<{ name: string; avatar?: Blob }>) {
  return (
    <Stack alignItems="center" width="100%" gap={1}>
      <ChatbotAvatar avatar={avatar} />
      <Typography variant="h4" component="h1">
        {name}
      </Typography>
    </Stack>
  );
}

export default ChatbotHeader;
