import { useTranslation } from 'react-i18next';

import { Button, FormControlLabel } from '@mui/material';

import { UUID } from '@graasp/sdk';

import { CommentAppData } from '@/config/appData';
import { mutations } from '@/config/queryClient';
import { ORPHAN_BUTTON_CYPRESS } from '@/config/selectors';
import { getOrphans, getThreadIdsFromFirstCommentId } from '@/utils/comments';

type Props = {
  comments: CommentAppData[];
};

function OrphanComments({ comments }: Readonly<Props>): JSX.Element | null {
  const { t } = useTranslation();
  const { mutate: deleteAppData } = mutations.useDeleteAppData();

  const getOrphanComments = (allComments: CommentAppData[]): UUID[][] => {
    const orphans = getOrphans(allComments);
    return orphans.map((o) => getThreadIdsFromFirstCommentId(comments, o.id));
  };

  const handleOnClickRemoveOrphans = (orphanThreads: UUID[][]): void => {
    orphanThreads.forEach((thread) => {
      thread.forEach((id) => {
        deleteAppData({ id });
      });
    });
  };

  const orphanThreads = getOrphanComments(comments);

  if (!orphanThreads.length) {
    return null;
  }

  const buttonControl = (
    <Button
      data-cy={ORPHAN_BUTTON_CYPRESS}
      variant="outlined"
      color="primary"
      onClick={() => handleOnClickRemoveOrphans(orphanThreads)}
      disabled={orphanThreads.length === 0}
    >
      {t('REMOVE_ORPHANS_LABEL')}
    </Button>
  );
  const totalNumberOfOrphanComments = orphanThreads.reduce(
    (tot, thread) => tot + thread.length,
    0,
  );
  const buttonLabel = t('NUMBER_OF_ORPHAN_THREADS', {
    threads: orphanThreads.length,
    count: totalNumberOfOrphanComments,
  });

  return <FormControlLabel control={buttonControl} label={buttonLabel} />;
}

export default OrphanComments;
