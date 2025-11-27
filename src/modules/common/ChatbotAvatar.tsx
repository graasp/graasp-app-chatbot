import { Avatar, Skeleton } from '@mui/material';

import { BotIcon } from 'lucide-react';

function ChatbotAvatar({
  avatar,
  size = 'medium',
  isLoading,
}: Readonly<{
  avatar?: Blob;
  size?: 'medium' | 'small';
  isLoading?: boolean;
}>) {
  const avatarSize = 'medium' === size ? 56 : undefined;
  const iconSize = 'medium' === size ? 40 : undefined;

  if (avatar) {
    return (
      <Avatar
        sx={{
          backgroundColor: 'var(--graasp-primary)',
          width: avatarSize,
          height: avatarSize,
        }}
        src={avatar ? URL.createObjectURL(avatar) : 'undefined'}
      />
    );
  }

  if (isLoading) {
    return (
      <Skeleton variant="circular" width={avatarSize} height={avatarSize} />
    );
  }

  return (
    <Avatar
      sx={{
        width: avatarSize,
        height: avatarSize,
        backgroundColor: 'var(--graasp-primary)',
      }}
    >
      <BotIcon size={iconSize} color="#fff" />
    </Avatar>
  );
}

export default ChatbotAvatar;
