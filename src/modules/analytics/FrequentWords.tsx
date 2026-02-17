import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { AppAction } from '@graasp/sdk';

import type { CommentData } from '@/config/appData';
import {
  ADD_CUSTOM_WORD_INPUT_ID,
  buildCheckWholeMemberChatButtonId,
  buildKeywordChipId,
} from '@/config/selectors';

import { ConversationForUser } from '../comment/ConversationForUser';
import KeywordChip from '../common/KeywordChip';
import TextWithHighlightedKeywords from '../common/TextWithHighlightedKeywords';
import { createRegexFromString, getTopFrequentWords } from './utils';

type Props = {
  commentsByUserSide: AppAction<CommentData>[];
  allWords: { [key: string]: number };
};

function FrequentWords({
  commentsByUserSide,
  allWords,
}: Readonly<Props>): JSX.Element {
  const { t } = useTranslation();

  const mostFrequentWordsWithCount = getTopFrequentWords(allWords, 5);
  const mostFrequentWords = Object.keys(mostFrequentWordsWithCount);

  const [selectedFrequentWords, setSelectedFrequentWords] =
    useState<string[]>(mostFrequentWords);

  const [selectedCustomWords, setSelectedCustomWords] = useState<string[]>([]);
  const [customWord, setCustomWord] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<null | {
    accountId: string;
    conversationId?: string;
  }>(null);

  const closeConversation = () => {
    setSelectedConversation(null);
  };

  const isAllSelected = mostFrequentWords.every(
    (ele) => -1 < selectedFrequentWords.indexOf(ele),
  );

  const commentsMatchSelectedWords = useMemo(
    () =>
      0 < commentsByUserSide.length
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
    if (-1 < selectedFrequentWords.indexOf(text)) {
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
            isSelected={-1 < selectedFrequentWords.indexOf(text)}
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
            if ('Enter' === event.key) {
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
      <Stack spacing={2} p={1}>
        {commentsMatchSelectedWords.map((ele) => (
          <TextWithHighlightedKeywords
            key={ele.id}
            sentence={ele.data.content}
            memberName={ele.account.name}
            words={[...selectedFrequentWords, ...selectedCustomWords]}
            onClick={() =>
              setSelectedConversation({
                accountId: ele.account.id,
                conversationId: ele.data.conversationId,
              })
            }
            buttonId={buildCheckWholeMemberChatButtonId(ele.account.id)}
          />
        ))}

        {
          // oxlint-disable-next-line eslint/yoda
          commentsMatchSelectedWords.length === 0 && (
            <Typography mt={2}>{t('NO_RESULTS_MATCH_WORDS')}</Typography>
          )
        }
      </Stack>
      {selectedConversation && (
        <Dialog open onClose={closeConversation}>
          <DialogTitle>{t('ANALYTICS_CONVERSATION_MEMBER')}</DialogTitle>
          <DialogContent>
            <ConversationForUser
              accountId={selectedConversation.accountId}
              conversationId={selectedConversation.conversationId}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConversation}>{t('CLOSE')}</Button>
          </DialogActions>
        </Dialog>
      )}
    </Stack>
  );
}

export default FrequentWords;
