import { Avatar } from '@mui/material';

import { BotIcon } from 'lucide-react';

function ChatbotAvatar() {
  return (
    <Avatar
      sx={{
        backgroundColor: 'var(--graasp-primary)',
      }}
    >
      <BotIcon color="#fff" />
    </Avatar>
  );
}

export default ChatbotAvatar;
