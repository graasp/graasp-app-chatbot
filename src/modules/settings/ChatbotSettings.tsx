import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  Button,
  Card,
  CardContent,
  FormLabel,
  Grid2,
  Stack,
  Typography,
} from '@mui/material';

import { Edit, Undo2 } from 'lucide-react';

import type { ChatbotPromptSettings } from '@/config/appSetting';
import { SettingsKeys } from '@/config/appSetting';
import { hooks, mutations } from '@/config/queryClient';
import { CHATBOT_SETTINGS_SUMMARY_CY } from '@/config/selectors';
import { DEFAULT_BOT_USERNAME } from '@/constants';

import ChatbotAvatar from '../common/ChatbotAvatar';
import { useChatbotAvatar } from '../common/useChatbotAvatar';
import { ChatbotEditionView } from './chatbot/ChatbotEditingView';
import { ChatbotPromptDisplay } from './chatbot/ChatbotPromptDisplay';
import { useSaveAvatar } from './useNewAvatar';

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
  const { avatar } = useChatbotAvatar();

  const initialPrompt = setting?.data?.initialPrompt ?? '';

  const saveSetting = useCallback(
    async (data: ChatbotPromptSettings): Promise<void> => {
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
    initialPrompt,
    chatbotCue,
    chatbotName,
    chatbotAvatar: avatar,
    saveSetting,
  };
};

function ChatbotSettings() {
  const { t } = useTranslation();

  const { saveSetting, chatbotCue, chatbotName, initialPrompt, chatbotAvatar } =
    useChatbotSetting();
  const saveNewAvatar = useSaveAvatar();

  const [isEditing, setIsEditing] = useState(false);

  const doneEditing = (): void => {
    setIsEditing(false);
  };

  const handleOnSave = async (data: ChatbotPromptSettings, avatar?: Blob) => {
    await saveSetting(data);

    if (avatar) {
      await saveNewAvatar(avatar);
    }

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
      {!initialPrompt && (
        <Alert severity="warning">{t('CHATBOT_CONFIGURATION_MISSING')}</Alert>
      )}

      {isEditing ? (
        <ChatbotEditionView
          initialValue={{
            name: chatbotName,
            cue: chatbotCue,
            prompt: initialPrompt,
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
            <Grid2 container rowGap={2} spacing={1}>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <FormLabel sx={{ fontWeight: 'bold' }}>
                  {t('CHATBOT_AVATAR_LABEL')}
                </FormLabel>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 8 }}>
                <ChatbotAvatar avatar={chatbotAvatar} size="small" />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <FormLabel sx={{ fontWeight: 'bold' }}>
                  {t('CHATBOT_NAME_LABEL')}
                </FormLabel>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 8 }}>
                <Stack direction="row" gap={1}>
                  <Typography>{chatbotName}</Typography>
                  {chatbotName === DEFAULT_BOT_USERNAME && (
                    <Typography color="text.disabled">
                      {t('CHATBOT_NAME_DEFAULT_MESSAGE')}
                    </Typography>
                  )}
                </Stack>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <FormLabel sx={{ fontWeight: 'bold' }}>
                  {t('CHATBOT_PROMPT_LABEL')}
                </FormLabel>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 8 }}>
                <ChatbotPromptDisplay prompt={initialPrompt} />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <FormLabel sx={{ fontWeight: 'bold' }}>
                  {t('CHATBOT_CUE_LABEL')}
                </FormLabel>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 8 }}>
                {chatbotCue ? (
                  <Typography>{chatbotCue}</Typography>
                ) : (
                  <Typography color="text.disabled" fontStyle="italic">
                    {t('CHATBOT_CUE_EMPTY_MESSAGE')}
                  </Typography>
                )}
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
export default ChatbotSettings;
