import { Box, SxProps, Theme } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { UUID } from '@graasp/sdk';

import { CommentData } from '@/config/appData';
import { hooks } from '@/config/queryClient';
import { PLAYER_VIEW_CY } from '@/config/selectors';
import ChatbotPrompt from '@/modules/common/ChatbotPrompt';
import CommentThread from '@/modules/common/CommentThread';

type Props = {
  id?: UUID;
  threadSx?: SxProps<Theme>;
};

const PlayerView = ({ id, threadSx = {} }: Props): JSX.Element => {
  const { data: appData } = hooks.useAppData<CommentData>();

  let { memberId } = useLocalContext();
  if (id) {
    memberId = id;
  }

  const comments = appData?.filter((res) => res.creator?.id === memberId);

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 10 },
        maxWidth: '100ch',
        m: 'auto',
        height: '100%',
      }}
      data-cy={PLAYER_VIEW_CY}
    >
      <ChatbotPrompt id={memberId} />
      <CommentThread threadSx={threadSx}>{comments}</CommentThread>
    </Box>
  );
};
export default PlayerView;
