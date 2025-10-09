import type { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import type { UUID } from '@graasp/sdk';

import type { CommentData } from '@/config/appData';
import { hooks } from '@/config/queryClient';
import { PLAYER_VIEW_CY } from '@/config/selectors';
import ChatbotPrompt from '@/modules/common/ChatbotPrompt';
import CommentThread from '@/modules/common/CommentThread';

type Props = {
  id?: UUID;
  threadSx?: SxProps<Theme>;
};

function PlayerView({ id, threadSx = {} }: Readonly<Props>) {
  const { data: appData } = hooks.useAppData<CommentData>();

  let { accountId } = useLocalContext();
  if (id) {
    accountId = id;
  }

  const comments = appData?.filter((res) => res.creator?.id === accountId);

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
      <ChatbotPrompt id={accountId} />
      <CommentThread threadSx={threadSx}>{comments}</CommentThread>
    </Box>
  );
}
export default PlayerView;
