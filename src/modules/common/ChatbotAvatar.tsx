import { Avatar } from '@mui/material';

import { BotIcon } from 'lucide-react';

function ChatbotAvatar({ avatar }: Readonly<{ avatar?: Blob }>) {
  if (avatar) {
    return (
      <Avatar
        sx={{
          backgroundColor: 'var(--graasp-primary)',
          width: 56,
          height: 56,
        }}
        src={avatar ? URL.createObjectURL(avatar) : 'undefined'}
      />
    );
  }

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
