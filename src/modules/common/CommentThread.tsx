import { Fragment } from 'react';

import type { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';

import type { CommentAppData } from '@/config/appData';
import { COMMENT_THREAD_CONTAINER_CYPRESS } from '@/config/selectors';

import Comment from './Comment';

type Props = {
  comments?: CommentAppData[];
  threadSx: SxProps<Theme>;
};

function CommentThread({
  comments,
  threadSx,
}: Readonly<Props>): JSX.Element | null {
  //oxlint-disable-next-line eslint/yoda
  if (!comments || comments.length === 0) {
    return null;
  }

  return (
    <Box data-cy={COMMENT_THREAD_CONTAINER_CYPRESS} sx={threadSx}>
      {comments.map((c) => (
        <Fragment key={c.id}>
          <Comment comment={c} />
        </Fragment>
      ))}
    </Box>
  );
}

export default CommentThread;
