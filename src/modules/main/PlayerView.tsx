import { FC } from 'react';

import { Box } from '@mui/material';

import { UUID, useLocalContext } from '@graasp/apps-query-client';

import { List } from 'immutable';

import { COMMENT_APP_DATA_TYPES } from '@/config/appDataTypes';
import { PLAYER_VIEW_CY } from '@/config/selectors';
import { CommentType } from '@/interfaces/comment';
import ChatbotPrompt from '@/modules/common/ChatbotPrompt';
import CommentThread from '@/modules/common/CommentThread';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { ReviewProvider } from '@/modules/context/ReviewContext';

import LoadingIndicatorProvider from '../context/LoadingIndicatorContext';

type Props = {
  id?: UUID;
};

const PlayerView: FC<Props> = ({ id }): JSX.Element => {
  const { appData } = useAppDataContext();

  let { memberId } = useLocalContext();
  if (id) {
    memberId = id;
  }

  const comments = appData?.filter(
    (res) =>
      COMMENT_APP_DATA_TYPES.includes(res.type) && res.creator === memberId,
  ) as List<CommentType>;

  return (
    <div data-cy={PLAYER_VIEW_CY}>
      <ReviewProvider>
        <LoadingIndicatorProvider>
          <Box sx={{ p: 10 }}>
            <ChatbotPrompt id={memberId} />
            <CommentThread>{comments}</CommentThread>
          </Box>
        </LoadingIndicatorProvider>
      </ReviewProvider>
    </div>
  );
};

export default PlayerView;
