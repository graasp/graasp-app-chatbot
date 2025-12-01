import { useRef } from 'react';

import { Stack, Typography } from '@mui/material';

import { buildCommentContainerDataCy } from '@/config/selectors';

import ChatbotAvatar from './ChatbotAvatar';
import CommentBody from './CommentBody';
import CustomAvatar from './CustomAvatar';

type Props = {
  id: string;
  body: string;
  name: string;
  avatar?: Blob;
};

export function Comment({ id, body, name }: Readonly<Props>): JSX.Element {
  const commentRef = useRef<HTMLDivElement>(null);

  return (
    <Stack data-cy={buildCommentContainerDataCy(id)} ref={commentRef}>
      <Stack
        direction="row-reverse"
        alignItems="end"
        justifyContent="end"
        gap={1}
        pl={10}
      >
        <Stack>
          <CustomAvatar username={name} />
        </Stack>
        <Stack sx={{ py: 0 }} alignItems="end" gap={1}>
          <Typography variant="subtitle2">{name}</Typography>
          <CommentBody background={'#ddd'}>{body}</CommentBody>
        </Stack>
      </Stack>
    </Stack>
  );
}

export function BotComment({
  id,
  body,
  name,
  avatar,
}: Readonly<Props>): JSX.Element {
  const commentRef = useRef<HTMLDivElement>(null);

  return (
    <Stack data-cy={buildCommentContainerDataCy(id)} ref={commentRef}>
      <Stack
        direction="row"
        alignItems="end"
        justifyContent="start"
        gap={1}
        pr={10}
      >
        <Stack>
          <ChatbotAvatar size="small" avatar={avatar} />;
        </Stack>
        <Stack sx={{ py: 0 }} alignItems="start" gap={1}>
          <Typography variant="subtitle2">{name}</Typography>
          <CommentBody>{body}</CommentBody>
        </Stack>
      </Stack>
    </Stack>
  );
}
