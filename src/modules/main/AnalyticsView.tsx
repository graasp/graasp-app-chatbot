import { useTranslation } from 'react-i18next';

import CommentIcon from '@mui/icons-material/Comment';
import PeopleIcon from '@mui/icons-material/People';
import { Alert, Box, Grid } from '@mui/material';

import { AppAction } from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import groupBy from 'lodash.groupby';

import { AppActionsType } from '@/config/appActions';
import { CommentData } from '@/config/appData';
import { hooks } from '@/config/queryClient';
import { ANALYTICS_VIEW_CY } from '@/config/selectors';

import CommonWords from '../analytics/CommonWords';
import StatisticCard from '../analytics/StatisticCard';

const AnalyticsView = (): JSX.Element => {
  const { data: actions, isLoading } = hooks.useAppActions();
  const { t } = useTranslation();

  if (actions) {
    const actionsGroupedByType = groupBy(actions, 'type');
    const commentsByUserSide = actionsGroupedByType[
      AppActionsType.Reply
    ] as AppAction<CommentData>[];
    const commentsByMembers = groupBy(commentsByUserSide, 'member.id');

    return (
      <Box data-cy={ANALYTICS_VIEW_CY}>
        <Box>
          {commentsByUserSide ? (
            <>
              <Grid container spacing={2} marginTop={1} justifyContent="center">
                <StatisticCard
                  icon={<CommentIcon fontSize="large" color="primary" />}
                  title={t('STATISTIC_TOTAL_USER_COMMENTS_TITLE')}
                  stat={commentsByUserSide.length}
                />
                <StatisticCard
                  icon={<PeopleIcon fontSize="large" color="primary" />}
                  title={t('STATISTIC_AVERAGE_USER_COMMENTS_TITLE')}
                  stat={
                    commentsByUserSide.length /
                    Object.keys(commentsByMembers).length
                  }
                />
              </Grid>

              <CommonWords commentsByUserSide={commentsByUserSide} />
            </>
          ) : (
            <Alert severity="warning">
              {t('NO_REPLIES_FOR_THIS_ITEM_YET')}
            </Alert>
          )}
        </Box>
      </Box>
    );
  }

  if (isLoading) {
    return <Loader />;
  }
  return <Alert severity="error">{t('UNEXPECTED_ERROR')}</Alert>;
};
export default AnalyticsView;
