import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Edit, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormLabel,
  Link,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
  styled,
} from '@mui/material';

import { Undo2 } from 'lucide-react';

import {
  ChatCompletionMessage,
  ChatbotPromptSettings,
  SettingsKeys,
} from '@/config/appSetting';
import { hooks, mutations } from '@/config/queryClient';
import { SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY } from '@/config/selectors';
import { DEFAULT_BOT_USERNAME, SMALL_BORDER_RADIUS } from '@/constants';
import { showErrorToast } from '@/utils/toast';

import CodeEditor from '../common/CodeEditor';

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

const ChatbotSettings = (): JSX.Element => {
  const { t } = useTranslation();
  const { mutate: postSetting } = mutations.usePostAppSetting();
  const { mutate: patchSetting } = mutations.usePatchAppSetting();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [formattingError, setFormattingError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { data: chatbotPromptSettings } =
    hooks.useAppSettings<ChatbotPromptSettings>({
      name: SettingsKeys.ChatbotPrompt,
    });
  const chatbotPrompt = chatbotPromptSettings?.[0];
  const initialPrompt = chatbotPrompt?.data?.initialPrompt || [];
  const stringifiedJsonPrompt = JSON.stringify(initialPrompt, null, 2);
  const chatbotCue = chatbotPrompt?.data?.chatbotCue || '';
  const chatbotName = chatbotPrompt?.data?.chatbotName || DEFAULT_BOT_USERNAME;
  const [newChatbotPrompt, setNewChatbotPrompt] = useState(
    stringifiedJsonPrompt,
  );
  const [newChatbotCue, setNewChatbotCue] = useState(chatbotCue);
  const [newChatbotName, setNewChatbotName] = useState(chatbotName);

  const doneEditing = (): void => {
    setIsEditing(false);
  };

  const validatePrompt = <T,>(
    prompt: string,
    callbacks: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ): T | undefined => {
    try {
      const jsonNewChatbotPrompt = JSON.parse(prompt);
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
    setNewChatbotPrompt(value);
    setUnsavedChanges(true);
  };

  const handleChangeChatbotCue = (value: string): void => {
    setNewChatbotCue(value);
    setUnsavedChanges(true);
  };

  const handleChangeChatbotName = (value: string): void => {
    setNewChatbotName(value);
    setUnsavedChanges(true);
  };

  const handleCancel = (): void => {
    // reset fields
    setNewChatbotPrompt(stringifiedJsonPrompt);
    setNewChatbotName(chatbotName);
    setNewChatbotCue(chatbotCue);
    // resume editing
    doneEditing();
  };

  const handleSave = (): void => {
    const jsonNewChatbotPrompt = validatePrompt<ChatCompletionMessage[]>(
      newChatbotPrompt,
      {
        onError: () => {
          hasFormattingErrors();
          showErrorToast(t('ERROR_PROMPT_NOT_IN_JSON_FORMAT'));
        },
      },
    );
    if (jsonNewChatbotPrompt) {
      const data: ChatbotPromptSettings = {
        initialPrompt: jsonNewChatbotPrompt,
        chatbotCue: newChatbotCue,
        chatbotName: newChatbotName,
      };
      // setting does not exist
      if (!chatbotPrompt) {
        postSetting({
          data,
          name: SettingsKeys.ChatbotPrompt,
        });
      } else {
        patchSetting({
          id: chatbotPrompt.id,
          data,
        });
      }
      doneEditing();
    }
  };

  return (
    <Stack spacing={1}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Typography variant="h2" fontWeight="bold" fontSize="1.5rem">
          {t('CHATBOT_SETTING_TITLE')}
        </Typography>
        <Button
          endIcon={isEditing ? <Undo2 /> : <Edit />}
          variant="outlined"
          onClick={() => {
            if (isEditing) {
              handleCancel();
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? t('CANCEL_LABEL') : t('EDIT_LABEL')}
        </Button>
      </Stack>
      {!chatbotPrompt && (
        <Alert severity="warning">{t('CHATBOT_CONFIGURATION_MISSING')}</Alert>
      )}

      {isEditing ? (
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
              value={newChatbotName}
              onChange={({ target: { value } }) =>
                handleChangeChatbotName(value)
              }
            />
          </Box>
          <Box>
            <Stack spacing={2}>
              <Stack>
                <FormLabel>{t('CHATBOT_PROMPT_LABEL')}</FormLabel>
                <Typography variant="caption" color="text.secondary">
                  {t('CHATBOT_PROMPT_HELPER')}
                </Typography>
                <CodeEditor
                  value={newChatbotPrompt}
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
                  expandIcon={<ExpandMore />}
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
              value={newChatbotCue}
              onChange={({ target: { value } }) =>
                handleChangeChatbotCue(value)
              }
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
      ) : (
        <Card elevation={0} variant="outlined">
          <CardContent sx={{ pb: 0 }}>
            <Stack direction="column" spacing={1}>
              <Stack direction="column">
                <Stack direction="row" spacing={1}>
                  <FormLabel>
                    <Typography>{t('CHATBOT_NAME_LABEL')}:</Typography>
                  </FormLabel>
                  <Typography>{chatbotName}</Typography>
                  {chatbotName === DEFAULT_BOT_USERNAME ? (
                    <Typography color="text.disabled">
                      ({t('CHATBOT_NAME_DEFAULT_MESSAGE')})
                    </Typography>
                  ) : null}
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {t('CHATBOT_NAME_HELPER')}
                </Typography>
              </Stack>
              <Stack direction="column">
                <FormLabel>{t('CHATBOT_PROMPT_LABEL')}:</FormLabel>
                <Typography variant="caption" color="text.secondary">
                  {t('CHATBOT_PROMPT_HELPER')}
                </Typography>
                <Box width="100%">
                  <CodeEditor value={stringifiedJsonPrompt} readOnly />
                </Box>
              </Stack>
              <Stack direction="column">
                <Stack>
                  <FormLabel>{t('CHATBOT_CUE_LABEL')}:</FormLabel>
                  <Typography variant="caption" color="text.secondary">
                    {t('CHATBOT_CUE_HELPER')}
                  </Typography>
                </Stack>
                {chatbotCue ? (
                  <Typography>{chatbotCue}</Typography>
                ) : (
                  <Typography color="text.disabled" fontStyle="italic">
                    {t('CHATBOT_CUE_EMPTY_MESSAGE')}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};
export default ChatbotSettings;
