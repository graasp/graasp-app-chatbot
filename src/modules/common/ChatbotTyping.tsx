import { Skeleton, Stack } from '@mui/material';

import ChatbotAvatar from './ChatbotAvatar';

export function ChatbotTyping({ avatar }: Readonly<{ avatar?: Blob }>) {
  return (
    <Stack direction="row" gap={1}>
      <ChatbotAvatar size="small" avatar={avatar} />
      <Skeleton
        sx={{ borderRadius: 2 }}
        variant="rectangular"
        width={300}
        height={40}
      />
    </Stack>
  );
}
