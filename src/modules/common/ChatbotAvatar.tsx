import { FC } from 'react';

import { Avatar } from '@mui/material';

import { BotIcon } from 'lucide-react';

const ChatbotAvatar: FC = () => (
  <Avatar
    sx={{
      backgroundColor: 'var(--graasp-primary)',
    }}
  >
    <BotIcon color="#fff" />
  </Avatar>
);

export default ChatbotAvatar;
