import {
  Alert,
  Chip,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';

import { DEPRECATED_GPT_MODELS, GPTVersion } from '@graasp/sdk';

import { t } from 'i18next';

import { ChatbotPromptSettings, SettingsKeys } from '@/config/appSetting';
import { hooks, mutations } from '@/config/queryClient';
import { DEFAULT_MODEL_VERSION } from '@/constants';

type ModelDef = {
  key: string;
  value: string;
  isRecommended: boolean;
  isDeprecated: boolean;
};

function compareModels(a: ModelDef, b: ModelDef): number {
  // 1. Recommended first
  if (a.isRecommended && !b.isRecommended) {
    return -1;
  }
  if (!a.isRecommended && b.isRecommended) {
    return 1;
  }

  // 2. Deprecated last
  if (a.isDeprecated && !b.isDeprecated) {
    return 1;
  }
  if (!a.isDeprecated && b.isDeprecated) {
    return -1;
  }

  // 3. Alphabetical by key
  return a.key.localeCompare(b.key);
}

// currently supported models
const models = Object.entries(GPTVersion)
  .reduce<ModelDef[]>((acc, [modelKey, modelName]) => {
    acc.push({
      key: modelKey,
      value: modelName,
      isDeprecated: (DEPRECATED_GPT_MODELS as string[]).includes(modelName),
      isRecommended: modelName === DEFAULT_MODEL_VERSION,
    });

    return acc;
  }, [])
  // sort models to put deprecated last in the list
  .toSorted(compareModels);

function ChatbotModelSelect({}) {
  const { data: chatbotPromptSettings } =
    hooks.useAppSettings<ChatbotPromptSettings>({
      name: SettingsKeys.ChatbotPrompt,
    });

  const version =
    chatbotPromptSettings?.[0]?.data?.gptVersion ?? DEFAULT_MODEL_VERSION;

  const { mutate: postAppSetting } = mutations.usePostAppSetting();
  const { mutate: patchAppSetting } = mutations.usePatchAppSetting();

  const handleChange = <T extends ChatbotPromptSettings, K extends keyof T>(
    value: T[K],
  ): void => {
    const settingId = chatbotPromptSettings?.[0]?.id;
    const data = { ...chatbotPromptSettings, gptVersion: value };
    if (settingId) {
      patchAppSetting({
        data,
        id: settingId,
      });
    } else {
      postAppSetting({
        data,
        name: SettingsKeys.ChatbotPrompt,
      });
    }
  };

  return (
    <Stack gap={1}>
      <Stack>
        <FormLabel>{t('MODEL_VERSION')}</FormLabel>
        <Typography variant="caption" color="text.secondary">
          {t('CHATBOT_MODEL_VERSION_HELPER', {
            default: DEFAULT_MODEL_VERSION,
          })}
        </Typography>
      </Stack>
      {(DEPRECATED_GPT_MODELS as string[]).includes(version) && (
        <Alert severity="warning">
          {t('CHATBOT_VERSION_DEPRECATED_MESSAGE')}
        </Alert>
      )}
      <Select
        value={version}
        label={t('MODEL_VERSION')}
        onChange={({ target: { value } }) => handleChange(value)}
        fullWidth
        renderValue={(selected) => <Typography>{selected}</Typography>}
      >
        {models.map(({ key, value, isRecommended, isDeprecated }) => (
          <MenuItem key={key} value={value} sx={{ display: 'block' }}>
            <Stack direction="row" spacing={1}>
              <Typography>{value}</Typography>
              {isRecommended && (
                <Chip label={t('RECOMMENDED')} size="small" color="primary" />
              )}
              {isDeprecated && <Chip label={t('DEPRECATED')} size="small" />}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {t(`${key}_DESCRIPTION`)}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
}

export default ChatbotModelSelect;
