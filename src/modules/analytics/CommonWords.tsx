import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import TaskAltIcon from '@mui/icons-material/TaskAlt';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { AppAction } from '@graasp/sdk';

import { CommentData } from '@/config/appData';
import { hooks } from '@/config/queryClient';

import KeywordChip from '../common/KeywordChip';
import TextWithHighlightedKeywords from '../common/TextWithHighlightedKeywords';
import PlayerView from '../main/PlayerView';
import WordCloud from './WordCloud';
import { getAllWords, getTopRepetitiveWords } from './utils';

type Props = {
  commentsByUserSide: AppAction<CommentData>[];
};

const CommonWords = ({ commentsByUserSide }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { data: appContext } = hooks.useAppContext();

  const allWords = getAllWords(commentsByUserSide, appContext?.item?.lang);

  const mostFrequentWords = getTopRepetitiveWords(allWords, 5);
  const options = Object.keys(allWords);
  const topRepetitiveWords = Object.keys(mostFrequentWords);

  const [selectedCommonWords, setSelectedCommonWords] =
    useState<string[]>(topRepetitiveWords);

  const [chatMemberID, setChatMemberID] = useState('');
  const [open, setOpen] = useState(false);

  const isAllSelected = topRepetitiveWords.every(
    (ele) => selectedCommonWords.indexOf(ele) > -1,
  );

  const commentsMatchSelectedWords = useMemo(
    () =>
      commentsByUserSide.length
        ? commentsByUserSide.filter(({ data: { content } }) =>
            selectedCommonWords.some((ele) => {
              const regex = new RegExp(
                ele.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                'i',
              );
              return regex.test(content);
            }),
          )
        : [],
    [selectedCommonWords, commentsByUserSide],
  );

  return (
    <>
      <Stack alignItems="center" spacing={2} mt={2}>
        <Box width="100%" display="flex" alignItems="center">
          <Box sx={{ width: { xs: 0, md: 300 } }} />
          <Typography textAlign="center" variant="h6" flexGrow={1}>
            {t('MOST_FREQUENT_WORDS_TITLE')}
            <Tooltip title={t('CHECK_WORDS_CLOUD')}>
              <IconButton onClick={() => setOpen(true)}>
                <TaskAltIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Typography>

          <Box sx={{ width: 300, marginLeft: 'auto' }}>
            <Autocomplete
              multiple
              options={options}
              size="small"
              limitTags={2}
              value={selectedCommonWords}
              onChange={(event, newValue: string[]) => {
                setSelectedCommonWords(newValue);
              }}
              defaultValue={selectedCommonWords}
              freeSolo
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t('SEARCH_COMMON_WORDS_PLACEHOLDER')}
                />
              )}
            />
          </Box>
        </Box>
        <Stack spacing={1} direction="row">
          {Object.entries(mostFrequentWords).map(([text, count]) => (
            <KeywordChip
              key={text}
              text={text}
              count={count}
              isSelected={selectedCommonWords.indexOf(text) > -1}
              onClick={() =>
                setSelectedCommonWords((prev) => {
                  if (prev.indexOf(text) > -1) {
                    return prev.filter((ele) => ele !== text);
                  }
                  return [...prev, text];
                })
              }
            />
          ))}
          <Button
            onClick={() => setSelectedCommonWords(topRepetitiveWords)}
            variant={isAllSelected ? 'contained' : 'outlined'}
          >
            {t('ALL')}
          </Button>
        </Stack>
        <Stack
          spacing={2}
          sx={{ maxHeight: '500px', overflow: 'auto', padding: '4px 8px' }}
        >
          {commentsMatchSelectedWords.map((ele) => (
            <TextWithHighlightedKeywords
              key={ele.id}
              sentence={ele.data.content}
              memberName={ele.member.name}
              words={selectedCommonWords}
              onClick={() => setChatMemberID(ele.member.id)}
            />
          ))}

          {commentsMatchSelectedWords.length === 0 && (
            <Typography mt={2}>{t('NO_RESULTS_MATCH_WORDS')}</Typography>
          )}
        </Stack>
      </Stack>

      <Dialog onClose={() => setChatMemberID('')} open={Boolean(chatMemberID)}>
        <DialogContent sx={{ px: 0 }}>
          <PlayerView id={chatMemberID} />
        </DialogContent>
      </Dialog>

      <WordCloud
        wordCounts={allWords}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default CommonWords;
