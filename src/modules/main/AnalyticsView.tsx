import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CloudIcon from '@mui/icons-material/Cloud';
import CommentIcon from '@mui/icons-material/Comment';
import PeopleIcon from '@mui/icons-material/People';
import { Alert, Box, Button, Grid2, Typography } from '@mui/material';

import { AppAction } from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import groupBy from 'lodash.groupby';

import { AppActionsType } from '@/config/appActions';
import { CommentData } from '@/config/appData';
import { hooks } from '@/config/queryClient';
import {
  ANALYTICS_GENERAL_TOTAL_COMMENTS_ID,
  ANALYTICS_GENERAL_WORDS_FREQUENCY_COMMENTS_ID,
  ANALYTICS_VIEW_CY,
} from '@/config/selectors';

import FrequentWords from '../analytics/FrequentWords';
import StatisticCard from '../analytics/StatisticCard';
import WordCloud from '../analytics/WordCloud';
import { getAllWords } from '../analytics/utils';

const AnalyticsView = (): JSX.Element => {
  const { data: actions, isLoading } = hooks.useAppActions();
  const { t } = useTranslation();
  const { data: appContext } = hooks.useAppContext();

  const [openWordCloud, setOpenWordCloud] = useState(false);

  if (actions) {
    const actionsGroupedByType = groupBy(actions, 'type');
    const commentsByUserSide = actionsGroupedByType[
      AppActionsType.Reply
    ] as AppAction<CommentData>[];
    const commentsByMembers = groupBy(commentsByUserSide, 'member.id');
    const allWords = getAllWords(commentsByUserSide, appContext?.item?.lang);

    return (
      <Box data-cy={ANALYTICS_VIEW_CY}>
        <Box>
          {commentsByUserSide ? (
            <>
              <Grid2
                container
                spacing={2}
                marginTop={1}
                justifyContent="center"
              >
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <StatisticCard
                    icon={<CommentIcon fontSize="large" color="primary" />}
                    title={t('STATISTIC_TOTAL_USER_COMMENTS_TITLE')}
                  >
                    <Typography
                      variant="h5"
                      component="div"
                      id={ANALYTICS_GENERAL_TOTAL_COMMENTS_ID}
                    >
                      {commentsByUserSide.length}
                    </Typography>
                  </StatisticCard>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <StatisticCard
                    icon={<PeopleIcon fontSize="large" color="primary" />}
                    title={t('STATISTIC_AVERAGE_USER_COMMENTS_TITLE')}
                  >
                    <Typography variant="h5" component="div">
                      {commentsByUserSide.length /
                        Object.keys(commentsByMembers).length}
                    </Typography>
                  </StatisticCard>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <StatisticCard
                    icon={<CloudIcon fontSize="large" color="primary" />}
                    title={t('WORDS_FREQUENCY')}
                  >
                    <Button
                      id={ANALYTICS_GENERAL_WORDS_FREQUENCY_COMMENTS_ID}
                      variant="text"
                      onClick={() => setOpenWordCloud(true)}
                      sx={{ textDecoration: 'underline' }}
                    >
                      {t('SEE_WORDS_CLOUD')}
                    </Button>
                  </StatisticCard>
                </Grid2>
              </Grid2>

              <FrequentWords
                commentsByUserSide={commentsByUserSide}
                allWords={allWords}
              />
              <WordCloud
                wordCounts={allWords}
                open={openWordCloud}
                onClose={() => setOpenWordCloud(false)}
              />
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
