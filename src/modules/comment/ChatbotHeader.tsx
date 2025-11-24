import React from 'react';

import { Stack, Typography } from '@mui/material';

import ChatbotAvatar from '../common/ChatbotAvatar';

function ChatbotHeader({ name }: Readonly<{ name: string }>) {
  return (
    <Stack alignItems="center" width="100%" gap={1}>
      <ChatbotAvatar />
      <Typography variant="h4" component="h1">
        {name}
      </Typography>
    </Stack>
  );
}

export default ChatbotHeader;
