import { useRef } from 'react';

import { Stack, Typography } from '@mui/material';

import { buildCommentContainerDataCy } from '@/config/selectors';

import ChatbotAvatar from './ChatbotAvatar';
import CommentBody from './CommentBody';
import CustomAvatar from './CustomAvatar';

type Props = {
  id: string;
  body: string;
  isBot: boolean;
  username: string;
};

export function Comment({
  id,
  isBot,
  body,
  username,
}: Readonly<Props>): JSX.Element {
  const commentRef = useRef<HTMLDivElement>(null);

  const avatar = isBot ? (
    <ChatbotAvatar />
  ) : (
    <CustomAvatar username={username} />
  );

  return (
    <Stack data-cy={buildCommentContainerDataCy(id)} ref={commentRef}>
      <Stack
        direction={isBot ? 'row' : 'row-reverse'}
        alignItems="end"
        justifyContent={isBot ? 'start' : 'end'}
        gap={1}
        pl={isBot ? 0 : 10}
        pr={isBot ? 10 : 0}
      >
        <Stack>{avatar}</Stack>
        <Stack sx={{ py: 0 }} alignItems={isBot ? 'start' : 'end'} gap={1}>
          <Typography variant="subtitle2">{username}</Typography>
          <CommentBody background={isBot ? undefined : '#ddd'}>
            {body}
          </CommentBody>
        </Stack>
      </Stack>
    </Stack>
  );
}
