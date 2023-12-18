import { useTranslation } from 'react-i18next';

import { FormLabel, Stack, TextField, Typography } from '@mui/material';

import {
  DEFAULT_GENERAL_SETTINGS,
  GeneralSettings,
  GeneralSettingsKeys,
  SettingsKeys,
} from '@/config/appSetting';
import { hooks, mutations } from '@/config/queryClient';
import {
  SETTING_MAX_COMMENT_LENGTH,
  SETTING_MAX_THREAD_LENGTH,
} from '@/config/selectors';

const GeneralSettingsView = (): JSX.Element => {
  const { t } = useTranslation();

  const { data: generalSettings } = hooks.useAppSettings<GeneralSettings>({
    name: SettingsKeys.General,
  });
  const { mutate: postAppSetting } = mutations.usePostAppSetting();
  const { mutate: patchAppSetting } = mutations.usePatchAppSetting();
  const generalSetting = generalSettings?.[0]?.data ?? DEFAULT_GENERAL_SETTINGS;

  const handleChange = <T extends GeneralSettings, K extends keyof T>(
    key: K,
    value: T[K],
  ): void => {
    const settingId = generalSettings?.[0]?.id;
    const data = { ...generalSetting, [key]: value };
    if (settingId) {
      patchAppSetting({
        data,
        id: settingId,
      });
    } else {
      postAppSetting({
        data,
        name: SettingsKeys.General,
      });
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
          {t('General')}
        </Typography>
      </Stack>
      <FormLabel>{t('Maximum comment length')}</FormLabel>
      <TextField
        id={SETTING_MAX_COMMENT_LENGTH}
        type="number"
        value={generalSetting[GeneralSettingsKeys.MaxCommentLength] ?? 0}
        onChange={(e) =>
          handleChange(
            GeneralSettingsKeys.MaxCommentLength,
            Math.max(0, window.parseInt(e.target.value)),
          )
        }
      />
      <FormLabel>{t('Maximum conversation length')}</FormLabel>
      <TextField
        id={SETTING_MAX_THREAD_LENGTH}
        type="number"
        value={generalSetting[GeneralSettingsKeys.MaxThreadLength] ?? 0}
        onChange={(e) =>
          handleChange(
            GeneralSettingsKeys.MaxThreadLength,
            Math.max(0, window.parseInt(e.target.value)),
          )
        }
      />
    </Stack>
  );
};
export default GeneralSettingsView;
