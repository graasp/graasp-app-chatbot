import { useState } from 'react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Stack, TextField } from '@mui/material';

import type { ChatbotPromptSettings } from '@/config/appSetting';
import { TextArea } from '@/modules/common/TextArea';

import { ChatbotAvatarEditor } from './ChatbotAvatarEditor';
import { ChatbotSetting } from './ChatbotSetting';

type Props = {
  initialValue: {
    name: string;
    cue: string;
    prompt: string;
  };
  onSave: (data: ChatbotPromptSettings) => void;
};

function ChatbotEditionView({
  initialValue,
  onSave,
}: Readonly<Props>): JSX.Element {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState(initialValue.prompt);
  const [cue, setCue] = useState(initialValue.cue);
  const [name, setName] = useState(initialValue.name);

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const onChangePrompt = (newValue: string) => {
    setPrompt(newValue);
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
    if (prompt) {
      const data: ChatbotPromptSettings = {
        initialPrompt: prompt,
        chatbotCue: cue,
        chatbotName: name,
      };
      onSave(data);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <ChatbotAvatarEditor />
        <TextField
          name={t('CHATBOT_NAME_LABEL')}
          label={t('CHATBOT_NAME_LABEL')}
          fullWidth
          value={name}
          onChange={({ target: { value } }) => handleChangeChatbotName(value)}
        />
      </Stack>

      <ChatbotSetting
        title={t('CHATBOT_PROMPT_LABEL')}
        description={t('CHATBOT_PROMPT_HELPER')}
      >
        <TextArea
          name={t('CHATBOT_PROMPT_LABEL')}
          value={prompt}
          onChange={({ target: { value } }) => onChangePrompt(value)}
          required
        />
      </ChatbotSetting>

      <ChatbotSetting
        title={t('CHATBOT_CUE_LABEL')}
        description={t('CHATBOT_CUE_HELPER')}
      >
        <TextArea
          name={t('CHATBOT_CUE_LABEL')}
          value={cue}
          onChange={({ target: { value } }) => handleChangeChatbotCue(value)}
        />
      </ChatbotSetting>

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
export { ChatbotEditionView };
