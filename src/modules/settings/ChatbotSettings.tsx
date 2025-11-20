import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  Button,
  Card,
  CardContent,
  FormLabel,
  Stack,
  Typography,
} from '@mui/material';

import { Edit, Undo2 } from 'lucide-react';

import type { ChatbotPromptSettings } from '@/config/appSetting';
import { SettingsKeys } from '@/config/appSetting';
import { hooks, mutations } from '@/config/queryClient';
import { CHATBOT_SETTINGS_SUMMARY_CY } from '@/config/selectors';
import { DEFAULT_BOT_USERNAME } from '@/constants';

import { ChatbotEditionView } from './chatbot/ChatbotEditingView';
import { ChatbotPromptDisplay } from './chatbot/ChatbotPromptDisplay';

const useChatbotSetting = () => {
  const { mutateAsync: postSetting } = mutations.usePostAppSetting();
  const { mutateAsync: patchSetting } = mutations.usePatchAppSetting();
  const { data: chatbotPromptSettings } =
    hooks.useAppSettings<ChatbotPromptSettings>({
      name: SettingsKeys.ChatbotPrompt,
    });
  const setting = chatbotPromptSettings?.[0];
  const chatbotCue = setting?.data?.chatbotCue ?? '';
  const chatbotName = setting?.data?.chatbotName ?? DEFAULT_BOT_USERNAME;

  const initialPrompt = setting?.data?.initialPrompt ?? [];
  const chatbotPrompt = initialPrompt[0]?.content ?? '';

  const saveSetting = useCallback(
    async (data: ChatbotPromptSettings): Promise<void> => {
      // setting does not exist
      if (setting) {
        await patchSetting({
          id: setting.id,
          data,
        });
      } else {
        await postSetting({
          data,
          name: SettingsKeys.ChatbotPrompt,
        });
      }
    },
    [patchSetting, postSetting, setting],
  );

  return {
    chatbotPrompt,
    chatbotCue,
    chatbotName,
    initialPrompt,
    saveSetting,
  };
};

function ChatbotSettings() {
  const { t } = useTranslation();

  const { saveSetting, chatbotCue, chatbotName, chatbotPrompt, initialPrompt } =
    useChatbotSetting();

  const [isEditing, setIsEditing] = useState(false);

  const doneEditing = (): void => {
    setIsEditing(false);
  };

  const handleOnSave = async (data: ChatbotPromptSettings) => {
    await saveSetting(data);

    // close the editing view
    doneEditing();
  };

  const handleCancel = (): void => {
    doneEditing();
  };

  return (
    <Stack spacing={3}>
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
        <ChatbotEditionView
          initialValue={{
            name: chatbotName,
            cue: chatbotCue,
            prompt: chatbotPrompt,
          }}
          onSave={handleOnSave}
        />
      ) : (
        <Card
          elevation={0}
          variant="outlined"
          data-cy={CHATBOT_SETTINGS_SUMMARY_CY}
        >
          <CardContent sx={{ pb: 0 }}>
            <Stack direction="column" spacing={1}>
              <Stack direction="column">
                <Stack direction="row" spacing={1}>
                  <FormLabel htmlFor="chatbotName">
                    <Typography>{t('CHATBOT_NAME_LABEL')}:</Typography>
                  </FormLabel>
                  <Typography>{chatbotName}</Typography>
                  {chatbotName === DEFAULT_BOT_USERNAME ? (
                    <Typography color="text.disabled">
                      ({t('CHATBOT_NAME_DEFAULT_MESSAGE')})
                    </Typography>
                  ) : undefined}
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {t('CHATBOT_NAME_HELPER')}
                </Typography>
              </Stack>

              <Stack direction="column">
                <FormLabel>{t('CHATBOT_PROMPT_LABEL')}</FormLabel>
                <ChatbotPromptDisplay messages={initialPrompt} />
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
}
export default ChatbotSettings;
