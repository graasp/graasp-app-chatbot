import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormLabel,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
  styled,
} from '@mui/material';

import { Undo2 } from 'lucide-react';

import { ChatbotPromptSettings, SettingsKeys } from '@/config/appSetting';
import { hooks, mutations } from '@/config/queryClient';
import { SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY } from '@/config/selectors';
import { DEFAULT_BOT_USERNAME, SMALL_BORDER_RADIUS } from '@/constants';

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

const SettingsView = (): JSX.Element => {
  const { t } = useTranslation();
  const { mutate: postSetting } = mutations.usePostAppSetting();
  const { mutate: patchSetting } = mutations.usePatchAppSetting();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
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

  const handleChangeChatbotPrompt = (value: string): void => {
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
    try {
      const jsonNewChatbotPrompt = JSON.parse(newChatbotPrompt);
      const data: ChatbotPromptSettings = {
        initialPrompt: jsonNewChatbotPrompt,
        chatbotCue: newChatbotCue,
        chatbotName: newChatbotName,
      };
      // todo handle saving settings
      console.warn('saving setting');
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
    } catch (e) {
      // todo: do something
      console.error('Prompt has to be in JSON format.');
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
          {t('Chatbot')}
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
          {isEditing ? t('Cancel') : t('Edit')}
        </Button>
      </Stack>
      {isEditing ? (
        <Stack>
          <Box>
            <FormLabel>{t('Chatbot Name')}</FormLabel>
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
            <FormLabel>{t('Prompt')}</FormLabel>
            <CodeEditor
              value={newChatbotPrompt}
              onChange={(value: string) => handleChangeChatbotPrompt(value)}
            />
          </Box>
          <Box>
            <FormLabel>{t('Cue')}</FormLabel>
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
              {unsavedChanges ? t('Save') : t('Saved')}
            </Button>
          </Box>
        </Stack>
      ) : (
        <Card elevation={0} variant="outlined">
          <CardContent sx={{ pb: 0 }}>
            <Stack direction="column" spacing={1}>
              <Stack direction="row" spacing={1}>
                <FormLabel>{t('Name')}:</FormLabel>
                <Typography>{chatbotName}</Typography>
              </Stack>
              <Stack direction="column">
                {/* todo: add explanations on how to use this */}
                <FormLabel>{t('Prompt')}:</FormLabel>
                <Box width="100%">
                  <CodeEditor value={stringifiedJsonPrompt} readOnly />
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <FormLabel>{t('Cue')}:</FormLabel>
                <Typography>{chatbotCue}</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};
export default SettingsView;
