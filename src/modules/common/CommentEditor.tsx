import { KeyboardEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  FormHelperText,
  IconButton,
  Stack,
  TextareaAutosize,
  styled,
} from '@mui/material';

import { SendHorizonal } from 'lucide-react';

import { DEFAULT_GENERAL_SETTINGS } from '@/config/appSetting';
import {
  COMMENT_EDITOR_CYPRESS,
  COMMENT_EDITOR_SAVE_BUTTON_CYPRESS,
  COMMENT_EDITOR_TEXTAREA_CYPRESS,
  COMMENT_EDITOR_TEXTAREA_HELPER_TEXT_CY,
} from '@/config/selectors';
import { SMALL_BORDER_RADIUS } from '@/constants';

const SendButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: 'white',

  '&:hover': {
    background: '#96CCFF',
  },
}));

const TextArea = styled(TextareaAutosize)(({ theme }) => ({
  borderRadius: SMALL_BORDER_RADIUS,
  padding: theme.spacing(1),
  fontSize: '1rem',
  boxSizing: 'border-box',
  resize: 'vertical',
  border: 0,
  outline: 'solid rgba(80, 80, 210, 0.5) 1px',
  width: '100%',
  minWidth: '0',
  transition: 'outline 250ms ease-in-out',
  '&:focus': {
    outline: 'solid var(--graasp-primary) 2px !important',
  },
  '&:hover': {
    outline: 'solid var(--graasp-primary) 1px ',
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

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
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
    <Box sx={{ p: 1 }} data-cy={COMMENT_EDITOR_CYPRESS}>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextArea
          data-cy={COMMENT_EDITOR_TEXTAREA_CYPRESS}
          placeholder={t('COMMENT_PLACEHOLDER')}
          minRows={1}
          maxRows={10}
          value={text}
          onChange={handleTextChange}
          role="textbox"
          // use default font instead of textarea's monospace font
          style={{ fontFamily: 'unset' }}
          onKeyDown={onKeyDown}
        />
        <FormHelperText data-cy={COMMENT_EDITOR_TEXTAREA_HELPER_TEXT_CY} error>
          {textTooLong || ' '}
        </FormHelperText>
        <SendButton
          onClick={onSend}
          data-cy={COMMENT_EDITOR_SAVE_BUTTON_CYPRESS}
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
