import { useState } from 'react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';

import { Undo2Icon } from 'lucide-react';

import { type ChatbotPromptSettings } from '@/config/appSetting';
import { TextArea } from '@/modules/common/TextArea';

import { ChatbotAvatarEditor } from './ChatbotAvatarEditor';
import { ChatbotSetting } from './ChatbotSetting';
import StarterSuggestions, { InternalSuggestion } from './StarterSuggestions';

type Props = {
  initialValue: {
    name: string;
    cue: string;
    prompt: string;
    starterSuggestions: string[];
  };
  onSave: (data: ChatbotPromptSettings, avatar?: Blob) => Promise<void>;
  onCancel: () => void;
};

function ChatbotEditionView({
  initialValue,
  onSave,
  onCancel,
}: Readonly<Props>): JSX.Element {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState(initialValue.prompt);
  const [cue, setCue] = useState(initialValue.cue);
  const [name, setName] = useState(initialValue.name);
  const [newAvatar, setNewAvatar] = useState<Blob>();
  const [isSaving, setIsSaving] = useState(false);

  // create id for suggestions, it is important for managing
  const [starterSuggestions, setStarterSuggestions] = useState(
    initialValue.starterSuggestions.map((s, idx) => ({ value: s, id: idx })),
  );

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

  const onChangeAvatar = (avatar: Blob) => {
    setNewAvatar(avatar);
    setUnsavedChanges(true);
  };

  const handleChangeStarterConversations = (
    value: InternalSuggestion[],
  ): void => {
    setStarterSuggestions(value);
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (prompt) {
      setIsSaving(true);

      const data: ChatbotPromptSettings = {
        initialPrompt: prompt,
        chatbotCue: cue,
        chatbotName: name,
        // remove empty values and revert to array of string
        starterSuggestions: starterSuggestions
          .filter((suggestion) => suggestion.value)
          .map(({ value }) => value),
      };
      await onSave(data, newAvatar);

      setIsSaving(false);
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Typography variant="h5" component="h1" fontWeight="bold">
            Edit chatbot
          </Typography>
          <Button endIcon={<Undo2Icon />} variant="outlined" onClick={onCancel}>
            {t('CANCEL_LABEL')}
          </Button>
        </Stack>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <ChatbotAvatarEditor onChange={onChangeAvatar} />
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

        <ChatbotSetting
          title={t('CHATBOT_STARTER_SUGGESTION_LABEL')}
          description={t('CHATBOT_STARTER_SUGGESTION_HELPER')}
        >
          <StarterSuggestions
            starterSuggestions={starterSuggestions}
            onChange={handleChangeStarterConversations}
          />
        </ChatbotSetting>

        <Box alignSelf="flex-end">
          <Button
            onClick={handleSave}
            disabled={!unsavedChanges || isSaving}
            variant="outlined"
            loading={isSaving}
          >
            {unsavedChanges ? t('SAVE_LABEL') : t('SAVED_LABEL')}
          </Button>
        </Box>
      </Stack>
    </>
  );
}
export { ChatbotEditionView };
