import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  FormHelperText,
  Stack,
  TextareaAutosize,
  styled,
} from '@mui/material';

import { SendHorizonal } from 'lucide-react';

import {
  ChatbotPromptSettings,
  DEFAULT_GENERAL_SETTINGS,
} from '@/config/appSetting';
import {
  COMMENT_EDITOR_CYPRESS,
  COMMENT_EDITOR_SAVE_BUTTON_CYPRESS,
  COMMENT_EDITOR_TEXTAREA_CYPRESS,
  COMMENT_EDITOR_TEXTAREA_HELPER_TEXT_CY,
} from '@/config/selectors';
import { SMALL_BORDER_RADIUS } from '@/constants';

import { useAskChatbot } from './useAskChatbot';
import { useSendMessage } from './useSendMessage';

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
  chatbotPrompt: ChatbotPromptSettings;
};

function CommentEditor({
  chatbotPrompt,
  maxTextLength = DEFAULT_GENERAL_SETTINGS.MaxCommentLength,
}: Readonly<Props>): JSX.Element {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [textTooLong, setTextTooLong] = useState('');

  const { generateChatbotAnswer, isLoading: askChatbotLoading } =
    useAskChatbot(chatbotPrompt);
  const { sendMessage, isLoading: sendMessageLoading } =
    useSendMessage(chatbotPrompt);

  const onSendHandler = async (newUserComment: string) => {
    if (!chatbotPrompt) {
      throw new Error(
        "unexpected error, chatbot setting is not present, can't sent to API without it",
      );
    }

    try {
      const userMessage = await sendMessage(newUserComment);

      await generateChatbotAnswer(userMessage.id, newUserComment);

      setText('');
    } catch (e) {
      console.error(e);
    }
  };

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

  return (
    <Box sx={{ p: 1 }} data-cy={COMMENT_EDITOR_CYPRESS}>
      <Stack direction="row" spacing={1}>
        <TextArea
          data-cy={COMMENT_EDITOR_TEXTAREA_CYPRESS}
          placeholder={t('COMMENT_PLACEHOLDER')}
          minRows={1}
          maxRows={10}
          value={text}
          onChange={handleTextChange}
          role="textbox"
          disabled={sendMessageLoading || askChatbotLoading}
          // use default font instead of textarea's monospace font
          style={{ fontFamily: 'unset' }}
        />
        <FormHelperText data-cy={COMMENT_EDITOR_TEXTAREA_HELPER_TEXT_CY} error>
          {textTooLong || ' '}
        </FormHelperText>
        <Button
          endIcon={<SendHorizonal />}
          data-cy={COMMENT_EDITOR_SAVE_BUTTON_CYPRESS}
          color="primary"
          variant="contained"
          onClick={() => onSendHandler(text)}
          loading={askChatbotLoading || sendMessageLoading}
          name="send"
        >
          {t('SEND_LABEL')}
        </Button>
      </Stack>
    </Box>
  );
}

export default CommentEditor;
