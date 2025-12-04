import { KeyboardEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  FormHelperText,
  IconButton,
  Stack,
  TextField,
  styled,
} from '@mui/material';

import { SendHorizonal } from 'lucide-react';

import { DEFAULT_GENERAL_SETTINGS } from '@/config/appSetting';

const SendButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: 'white',

  '&:hover': {
    background: '#96CCFF',
  },
}));

type Props = {
  maxTextLength?: number;
  send: (message: string) => Promise<void>;
  isLoading?: boolean;
};

function CommentEditor({
  send,
  isLoading,
  maxTextLength = DEFAULT_GENERAL_SETTINGS.MaxCommentLength,
}: Readonly<Props>): JSX.Element {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [textTooLong, setTextTooLong] = useState('');

  const handleTextChange = ({
    target: { value },
  }: {
    target: { value: string };
  }): void => {
    if (value.length < maxTextLength) {
      setText(value);
      setTextTooLong('');
    } else {
      setTextTooLong(t('COMMENT_TEXT_TOO_LONG', { max_length: maxTextLength }));
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    const { key, shiftKey } = event;
    // send message on enter if is not loading
    if ('Enter' === key && !shiftKey) {
      event.preventDefault();
      if (!isLoading) {
        onSend();
      }
    }
  };

  const onSend = async () => {
    try {
      setText('');
      await send(text);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          name={t('MESSAGE_INPUT_LABEL')}
          placeholder={t('COMMENT_PLACEHOLDER')}
          multiline
          fullWidth
          value={text}
          onChange={handleTextChange}
          onKeyDown={onKeyDown}
          minRows={1}
          maxRows={10}
          required
        />
        <FormHelperText error>{textTooLong || ' '}</FormHelperText>
        <SendButton
          onClick={onSend}
          name={t('SEND_MESSAGE_BUTTON')}
          disabled={isLoading}
        >
          <SendHorizonal />
        </SendButton>
      </Stack>
    </Box>
  );
}

export default CommentEditor;
