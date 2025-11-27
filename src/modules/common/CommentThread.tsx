import { useTranslation } from 'react-i18next';
import { Fragment } from 'react/jsx-runtime';

import type { SxProps, Theme } from '@mui/material';
import { Stack, Typography } from '@mui/material';

import { intlFormat } from 'date-fns';
import groupby from 'lodash.groupby';

import { Comment } from './Comment';
import { type Comment as CommentType } from './useConversation';

type Props = {
  comments?: CommentType[];
  threadSx?: SxProps<Theme>;
};

function CommentThread({
  comments,
  threadSx,
}: Readonly<Props>): JSX.Element | null {
  const { i18n } = useTranslation();

  //oxlint-disable-next-line eslint/yoda
  if (!comments || comments.length === 0) {
    return null;
  }

  const commentsPerDay = groupby(comments, (c) =>
    intlFormat(
      new Date(c.createdAt),
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
      { locale: i18n.language },
    ),
  );

  return (
    <Stack sx={threadSx}>
      {Object.entries(commentsPerDay).map(([date, commentsForDay]) => {
        return (
          <Fragment key={date}>
            <Typography
              variant="body2"
              align="center"
              color="textDisabled"
              sx={{ fontStyle: 'italic' }}
            >
              {date}
            </Typography>
            <Stack gap={2}>
              {commentsForDay.map((c) => {
                return (
                  <Comment
                    key={c.id}
                    id={c.id}
                    isBot={c.isBot}
                    username={c.username}
                    body={c.body}
                  />
                );
              })}
            </Stack>
          </Fragment>
        );
      })}
    </Stack>
  );
}

export default CommentThread;
