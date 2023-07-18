import { Box } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { UUID } from '@graasp/sdk';

import { CommentData } from '@/config/appData';
import { hooks } from '@/config/queryClient';
import { PLAYER_VIEW_CY } from '@/config/selectors';
import ChatbotPrompt from '@/modules/common/ChatbotPrompt';
import CommentThread from '@/modules/common/CommentThread';

type Props = {
  id?: UUID;
};

const PlayerView = ({ id }: Props): JSX.Element => {
  const { data: appData } = hooks.useAppData<CommentData>();

  let { memberId } = useLocalContext();
  if (id) {
    memberId = id;
  }

  const comments = appData?.filter((res) => res.creator?.id === memberId);

  return (
    <Box sx={{ px: 10 }} data-cy={PLAYER_VIEW_CY}>
      <ChatbotPrompt id={memberId} />
      <CommentThread>{comments}</CommentThread>
    </Box>
  );
};
export default PlayerView;
