import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormLabel,
  Stack,
  Typography,
} from '@mui/material';

import { DEPRECATED_GPT_MODELS } from '@graasp/sdk';

import { Edit, Undo2 } from 'lucide-react';

import { ChatbotPromptSettings, SettingsKeys } from '@/config/appSetting';
import { hooks, mutations } from '@/config/queryClient';
import { DEFAULT_BOT_USERNAME, DEFAULT_MODEL_VERSION } from '@/constants';

import CodeEditor from '../common/CodeEditor';
import { ChatbotEditionView } from './chatbot/ChatbotEditingView';
import { ChatbotPromptDisplay } from './chatbot/ChatbotPromptDisplay';
import {
  PromptDisplay,
  PromptDisplayType,
} from './chatbot/PromptDisplaySwitch';
import { PromptTitle } from './chatbot/PromptTitle';

function ChatbotSettings() {
  const { t } = useTranslation();
  const { mutateAsync: postSetting } = mutations.usePostAppSetting();
  const { mutateAsync: patchSetting } = mutations.usePatchAppSetting();
  const [isEditing, setIsEditing] = useState(false);
  const [viewType, setViewType] = useState<PromptDisplayType>(PromptDisplay.UI);

  const { data: chatbotPromptSettings } =
    hooks.useAppSettings<ChatbotPromptSettings>({
      name: SettingsKeys.ChatbotPrompt,
    });
  const chatbotPrompt = chatbotPromptSettings?.[0];
  const initialPrompt = chatbotPrompt?.data?.initialPrompt ?? [];
  const stringifiedJsonPrompt = JSON.stringify(initialPrompt, null, 2);
  const chatbotCue = chatbotPrompt?.data?.chatbotCue ?? '';
  const chatbotName = chatbotPrompt?.data?.chatbotName ?? DEFAULT_BOT_USERNAME;
  const chatbotVersion =
    chatbotPrompt?.data?.gptVersion ?? DEFAULT_MODEL_VERSION;

  const doneEditing = (): void => {
    setIsEditing(false);
  };

  const handleOnSave = async (data: ChatbotPromptSettings): Promise<void> => {
    // setting does not exist
    if (!chatbotPrompt) {
      await postSetting({
        data,
        name: SettingsKeys.ChatbotPrompt,
      });
    } else {
      await patchSetting({
        id: chatbotPrompt.id,
        data,
      });
    }
    // close the editing view
    doneEditing();
  };

  const handleCancel = (): void => {
    doneEditing();
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
        <ChatbotEditionView
          initialValue={{
            name: chatbotName,
            cue: chatbotCue,
            version: chatbotVersion,
            prompt: stringifiedJsonPrompt,
          }}
          viewType={viewType}
          onViewChange={setViewType}
          onSave={handleOnSave}
        />
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
                <Stack direction="row" spacing={1}>
                  <FormLabel> {t('MODEL_VERSION')}:</FormLabel>
                  <Typography>{chatbotVersion}</Typography>
                  {chatbotVersion === DEFAULT_MODEL_VERSION ? (
                    <Typography color="text.disabled">
                      ({t('CHATBOT_VERSION_DEFAULT_MESSAGE')})
                    </Typography>
                  ) : null}
                </Stack>
                {(DEPRECATED_GPT_MODELS as string[]).includes(
                  chatbotVersion,
                ) && (
                  <Alert severity="warning">
                    {t('CHATBOT_VERSION_DEPRECATED_MESSAGE')}
                  </Alert>
                )}
                <Typography variant="caption" color="text.secondary">
                  {t('CHATBOT_MODEL_VERSION_HELPER', {
                    default: DEFAULT_MODEL_VERSION,
                  })}
                </Typography>
              </Stack>
              <Stack direction="column">
                <PromptTitle view={viewType} onChange={setViewType} />
                {viewType === PromptDisplay.UI ? (
                  <ChatbotPromptDisplay messages={initialPrompt} />
                ) : (
                  <Box width="100%">
                    <CodeEditor value={stringifiedJsonPrompt} readOnly />
                  </Box>
                )}
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
