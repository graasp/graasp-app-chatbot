import { useState } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  FormLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
  styled,
} from '@mui/material';

import { ChatBotMessage, GPTVersion } from '@graasp/sdk';

import { t } from 'i18next';
import { ChevronDownIcon } from 'lucide-react';

import { ChatbotPromptSettings } from '@/config/appSetting';
import { SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY } from '@/config/selectors';
import { SMALL_BORDER_RADIUS } from '@/constants';
import CodeEditor from '@/modules/common/CodeEditor';
import { showErrorToast } from '@/utils/toast';

const TextArea = styled(TextareaAutosize)(({ theme }) => ({
  borderRadius: SMALL_BORDER_RADIUS,
  padding: theme.spacing(2),
  fontSize: '1rem',
  boxSizing: 'border-box',
  resize: 'vertical',
  border: 0,
  outline: 'solid rgba(80, 80, 210, 0.5) 1px',
  // make sure the outline is offset by the same amount that it is wide to not overflow
  outlineOffset: '-1px',
  width: '100%',
  minWidth: '0',
  minHeight: `calc(1rem + 2*${theme.spacing(2)})`,
  transition: 'outline 250ms ease-in-out',
  '&:focus': {
    outline: 'solid var(--graasp-primary) 2px !important',
  },
  '&:hover': {
    outline: 'solid var(--graasp-primary) 1px ',
  },
}));

type Props = {
  initialValue: {
    name: string;
    version: string;
    cue: string;
    prompt: string;
  };
  onSave: (data: ChatbotPromptSettings) => void;
};

export function ChatbotEditionView({
  initialValue,
  onSave,
}: Readonly<Props>): JSX.Element {
  const [prompt, setPrompt] = useState(initialValue.prompt);
  const [cue, setCue] = useState(initialValue.cue);
  const [name, setName] = useState(initialValue.name);
  const [version, setVersion] = useState(initialValue.version);
  const [formattingError, setFormattingError] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const validatePrompt = <T,>(
    promptValue: string,
    callbacks: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ): T | undefined => {
    try {
      const jsonNewChatbotPrompt = JSON.parse(promptValue);
      callbacks.onSuccess?.();
      return jsonNewChatbotPrompt;
    } catch {
      callbacks.onError?.();
    }
    return undefined;
  };

  const hasNoFormattingErrors = (): void => setFormattingError(false);
  const hasFormattingErrors = (): void => setFormattingError(true);

  const handleChangeChatbotPrompt = (value: string): void => {
    validatePrompt(value, {
      onSuccess: hasNoFormattingErrors,
      onError: hasFormattingErrors,
    });
    setPrompt(value);
    setUnsavedChanges(true);
  };

  const handleChangeChatbotVersion = (value: string): void => {
    setVersion(value as GPTVersion);
    setUnsavedChanges(true);
  };

  const handleChangeChatbotCue = (value: string): void => {
    setCue(value);
    setUnsavedChanges(true);
  };

  const handleChangeChatbotName = (value: string): void => {
    setName(value);
    setUnsavedChanges(true);
  };

  const handleSave = (): void => {
    const jsonNewChatbotPrompt = validatePrompt<ChatBotMessage[]>(prompt, {
      onError: () => {
        hasFormattingErrors();
        showErrorToast(t('ERROR_PROMPT_NOT_IN_JSON_FORMAT'));
      },
    });
    if (jsonNewChatbotPrompt) {
      const data: ChatbotPromptSettings = {
        initialPrompt: jsonNewChatbotPrompt,
        chatbotCue: cue,
        chatbotName: name,
        gptVersion: version,
      };
      onSave(data);
    }
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Stack>
          <FormLabel>{t('CHATBOT_NAME_LABEL')}</FormLabel>
          <Typography variant="caption" color="text.secondary">
            {t('CHATBOT_NAME_HELPER')}
          </Typography>
        </Stack>
        <TextField
          fullWidth
          id={SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY}
          value={name}
          onChange={({ target: { value } }) => handleChangeChatbotName(value)}
        />
      </Box>
      <Box>
        <Stack>
          <FormLabel>{t('MODEL_VERSION')}</FormLabel>
          <Typography variant="caption" color="text.secondary">
            {t('CHATBOT_MODEL_VERSION_HELPER')}
          </Typography>
        </Stack>
        <Select
          value={version}
          label={t('MODEL_VERSION')}
          onChange={({ target: { value } }) =>
            handleChangeChatbotVersion(value)
          }
          fullWidth
          renderValue={(selected) => <Typography>{selected}</Typography>}
        >
          {Object.entries(GPTVersion).map(([key, v]) => (
            <MenuItem key={v} value={v} sx={{ display: 'block' }}>
              <Stack direction="row" spacing={1}>
                <Typography>{v}</Typography>
                {v === GPTVersion.GPT_3_5_TURBO && (
                  <Chip label={t('RECOMMENDED')} size="small" color="primary" />
                )}
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {t(`${key}_DESCRIPTION`)}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        <Stack spacing={2}>
          <Stack>
            <FormLabel>{t('CHATBOT_PROMPT_LABEL')}</FormLabel>
            <Typography variant="caption" color="text.secondary">
              {t('CHATBOT_PROMPT_HELPER')}
            </Typography>
            <CodeEditor
              value={prompt}
              onChange={(value: string) => handleChangeChatbotPrompt(value)}
            />
            {formattingError ? (
              <Typography color="error">
                {t('ERROR_PROMPT_NOT_IN_JSON_FORMAT')}
              </Typography>
            ) : null}
          </Stack>
          <Accordion disableGutters>
            <AccordionSummary
              expandIcon={<ChevronDownIcon />}
              aria-controls="panel1-content"
              id="help-me"
            >
              {t('CHATBOT_PROMPT_HELPER_LABEL')}
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  {t('CHATBOT_PROMPT_FORMAT_HELPER')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('CHATBOT_PROMPT_FORMAT_EXAMPLE')}
                </Typography>
                <CodeEditor
                  value={JSON.stringify(
                    [
                      {
                        role: 'system',
                        content: 'You are a helpful assistant.',
                      },
                      {
                        role: 'user',
                        content: 'Who won the world series in 2020?',
                      },
                      {
                        role: 'assistant',
                        content:
                          'The Los Angeles Dodgers won the World Series in 2020.',
                      },
                      { role: 'user', content: 'Where was it played?' },
                    ],
                    null,
                    2,
                  )}
                  readOnly
                  fontSize="10px"
                />

                <Link
                  variant="caption"
                  target="_blank"
                  href="https://platform.openai.com/docs/api-reference/chat/create#chat-create-messages"
                >
                  {t('CHATBOT_PROMPT_API_REFERENCE')}
                </Link>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Box>

      <Box>
        <Stack>
          <FormLabel>{t('CHATBOT_CUE_LABEL')}</FormLabel>
          <Typography variant="caption" color="text.secondary">
            {t('CHATBOT_CUE_HELPER')}
          </Typography>
        </Stack>
        <TextArea
          id={SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY}
          value={cue}
          onChange={({ target: { value } }) => handleChangeChatbotCue(value)}
        />
      </Box>
      <Box alignSelf="flex-end">
        <Button
          onClick={handleSave}
          disabled={!unsavedChanges}
          variant="outlined"
        >
          {unsavedChanges ? t('SAVE_LABEL') : t('SAVED_LABEL')}
        </Button>
      </Box>
    </Stack>
  );
}
