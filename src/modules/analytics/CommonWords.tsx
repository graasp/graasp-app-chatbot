import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { AppAction } from '@graasp/sdk';

import { CommentData } from '@/config/appData';

import KeywordChip from '../common/KeywordChip';
import TextWithHighlightedKeywords from '../common/TextWithHighlightedKeywords';
import PlayerView from '../main/PlayerView';
import { createRegexFromString, getTopRepetitiveWords } from './utils';

type Props = {
  commentsByUserSide: AppAction<CommentData>[];
  allWords: { [key: string]: number };
};

const CommonWords = ({ commentsByUserSide, allWords }: Props): JSX.Element => {
  const { t } = useTranslation();

  const mostFrequentWords = getTopRepetitiveWords(allWords, 5);
  const topRepetitiveWords = Object.keys(mostFrequentWords);

  const [selectedCommonWords, setSelectedCommonWords] =
    useState<string[]>(topRepetitiveWords);

  const [selectedOtherWords, setSelectedOtherWords] = useState<string[]>([]);
  const [otherWord, setOtherWord] = useState('');
  const [chatMemberID, setChatMemberID] = useState('');

  const isAllSelected = topRepetitiveWords.every(
    (ele) => selectedCommonWords.indexOf(ele) > -1,
  );

  const commentsMatchSelectedWords = useMemo(
    () =>
      commentsByUserSide.length
        ? commentsByUserSide.filter(({ data: { content } }) =>
            [...selectedCommonWords, ...selectedOtherWords].some((ele) =>
              new RegExp(createRegexFromString(ele)).test(content),
            ),
          )
        : [],
    [selectedCommonWords, commentsByUserSide, selectedOtherWords],
  );

  const deleteCustomWord = (word: string): void => {
    setSelectedOtherWords(selectedOtherWords.filter((w) => w !== word));
  };
  const selectCommonChip = (text: string): void => {
    setSelectedCommonWords([...new Set([...selectedCommonWords, text])]);
  };

  return (
    <Stack spacing={2} mt={2}>
      <Typography variant="h6">{t('MOST_FREQUENT_WORDS_TITLE')}</Typography>
      <Typography variant="body1">{t('FILTER_BY_COMMON_KEYWORDS')}</Typography>
      <Stack spacing={1} direction="row">
        {Object.entries(mostFrequentWords).map(([text, count]) => (
          <KeywordChip
            key={text}
            text={text}
            count={count}
            isSelected={selectedCommonWords.indexOf(text) > -1}
            onClick={() => selectCommonChip(text)}
          />
        ))}
        <Button
          onClick={() => setSelectedCommonWords(topRepetitiveWords)}
          variant={isAllSelected ? 'contained' : 'outlined'}
        >
          {t('ALL')}
        </Button>
      </Stack>
      <Stack spacing={1} sx={{ maxWidth: 300 }}>
        <Typography variant="body1">{t('SEARCH_BY_OTHER_KEYWORDS')}</Typography>

        <TextField
          size="small"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              setSelectedOtherWords([
                ...new Set([...selectedOtherWords, otherWord]),
              ]);
              setOtherWord('');
            }
          }}
          value={otherWord}
          onChange={(e) => {
            setOtherWord(e.target.value);
          }}
          placeholder={t('SEARCH_COMMON_WORDS_PLACEHOLDER')}
        />
        <Stack spacing={1} direction="row">
          {selectedOtherWords.map((text) => (
            <Chip
              key={text}
              label={text}
              variant="outlined"
              onDelete={() => deleteCustomWord(text)}
            />
          ))}
        </Stack>
      </Stack>
      <Grid container sx={{ height: '500px' }}>
        <Grid item xs={12} md={6} sx={{ height: '100%', overflowY: 'auto' }}>
          <Stack spacing={2} p={1}>
            {commentsMatchSelectedWords.map((ele) => (
              <TextWithHighlightedKeywords
                key={ele.id}
                sentence={ele.data.content}
                memberName={ele.member.name}
                words={[...selectedCommonWords, ...selectedOtherWords]}
                onClick={() => setChatMemberID(ele.member.id)}
              />
            ))}

            {commentsMatchSelectedWords.length === 0 && (
              <Typography mt={2}>{t('NO_RESULTS_MATCH_WORDS')}</Typography>
            )}
          </Stack>
        </Grid>
        {chatMemberID && (
          <Grid item xs={12} md={6} sx={{ height: '100%', overflowY: 'auto' }}>
            <PlayerView id={chatMemberID} />
          </Grid>
        )}
      </Grid>
    </Stack>
  );
};

export default CommonWords;
