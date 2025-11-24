import { useRef } from 'react';

import { Stack, Typography } from '@mui/material';

import { buildCommentContainerDataCy } from '@/config/selectors';

import ChatbotAvatar from './ChatbotAvatar';
import CommentBody from './CommentBody';
import CustomAvatar from './CustomAvatar';

type Props = {
  body: string;
  isBot: boolean;
  id: string;
  username: string;
};

function Comment({ id, isBot, body, username }: Readonly<Props>): JSX.Element {
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
      >
        <Stack>{avatar}</Stack>
        <Stack
          sx={{ p: 2, py: 0, '&:last-child': { pb: 0 } }}
          alignItems={isBot ? 'start' : 'end'}
          gap={1}
        >
          <Typography variant="subtitle2">{username}</Typography>
          <CommentBody>{body}</CommentBody>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Comment;
