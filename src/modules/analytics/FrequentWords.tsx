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
import {
  ADD_CUSTOM_WORD_INPUT_ID,
  buildCheckWholeMemberChatButtonId,
  buildKeywordChipId,
} from '@/config/selectors';

import KeywordChip from '../common/KeywordChip';
import TextWithHighlightedKeywords from '../common/TextWithHighlightedKeywords';
import PlayerView from '../main/PlayerView';
import { createRegexFromString, getTopFrequentWords } from './utils';

type Props = {
  commentsByUserSide: AppAction<CommentData>[];
  allWords: { [key: string]: number };
};

const FrequentWords = ({
  commentsByUserSide,
  allWords,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const mostFrequentWordsWithCount = getTopFrequentWords(allWords, 5);
  const mostFrequentWords = Object.keys(mostFrequentWordsWithCount);

  const [selectedFrequentWords, setSelectedFrequentWords] =
    useState<string[]>(mostFrequentWords);

  const [selectedCustomWords, setSelectedCustomWords] = useState<string[]>([]);
  const [customWord, setCustomWord] = useState('');
  const [chatMemberID, setChatMemberID] = useState('');

  const isAllSelected = mostFrequentWords.every(
    (ele) => selectedFrequentWords.indexOf(ele) > -1,
  );

  const commentsMatchSelectedWords = useMemo(
    () =>
      commentsByUserSide.length
        ? commentsByUserSide.filter(({ data: { content } }) =>
            [...selectedFrequentWords, ...selectedCustomWords].some((ele) =>
              new RegExp(createRegexFromString(ele)).test(content),
            ),
          )
        : [],
    [selectedFrequentWords, commentsByUserSide, selectedCustomWords],
  );

  const deleteCustomWord = (word: string): void => {
    setSelectedCustomWords(selectedCustomWords.filter((w) => w !== word));
  };
  const selectFrequentChip = (text: string): void => {
    if (selectedFrequentWords.indexOf(text) > -1) {
      setSelectedFrequentWords(
        selectedFrequentWords.filter((ele) => ele !== text),
      );
    } else {
      setSelectedFrequentWords([...new Set([...selectedFrequentWords, text])]);
    }
  };
  return (
    <Stack spacing={2} mt={2}>
      <Typography variant="h6">{t('MOST_FREQUENT_WORDS_TITLE')}</Typography>
      <Typography variant="body1">{t('FILTER_BY_COMMON_KEYWORDS')}</Typography>
      <Stack spacing={1} direction="row">
        {Object.entries(mostFrequentWordsWithCount).map(([text, count]) => (
          <KeywordChip
            key={text}
            text={text}
            count={count}
            isSelected={selectedFrequentWords.indexOf(text) > -1}
            onClick={() => selectFrequentChip(text)}
          />
        ))}
        <Button
          onClick={() => setSelectedFrequentWords(mostFrequentWords)}
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
              setSelectedCustomWords([
                ...new Set([...selectedCustomWords, customWord]),
              ]);
              setCustomWord('');
            }
          }}
          value={customWord}
          onChange={(e) => {
            setCustomWord(e.target.value);
          }}
          id={ADD_CUSTOM_WORD_INPUT_ID}
          placeholder={t('SEARCH_COMMON_WORDS_PLACEHOLDER')}
        />
        <Stack spacing={1} direction="row">
          {selectedCustomWords.map((text) => (
            <Chip
              key={text}
              label={text}
              variant="outlined"
              onDelete={() => deleteCustomWord(text)}
              id={buildKeywordChipId(text)}
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
                words={[...selectedFrequentWords, ...selectedCustomWords]}
                onClick={() => setChatMemberID(ele.member.id)}
                buttonId={buildCheckWholeMemberChatButtonId(ele.member.id)}
              />
            ))}

            {commentsMatchSelectedWords.length === 0 && (
              <Typography mt={2}>{t('NO_RESULTS_MATCH_WORDS')}</Typography>
            )}
          </Stack>
        </Grid>
        {chatMemberID && (
          <Grid item xs={12} md={6} sx={{ height: '100%', overflow: 'hidden' }}>
            <PlayerView
              id={chatMemberID}
              threadSx={{ overflow: 'auto', height: '100%' }}
            />
          </Grid>
        )}
      </Grid>
    </Stack>
  );
};

export default FrequentWords;
