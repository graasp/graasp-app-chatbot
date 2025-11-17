import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { FormLabel, Stack, TextField, Typography } from '@mui/material';

import type { GeneralSettings } from '@/config/appSetting';
import {
  DEFAULT_GENERAL_SETTINGS,
  GeneralSettingsKeys,
  SettingsKeys,
} from '@/config/appSetting';
import { hooks, mutations } from '@/config/queryClient';
import {
  SETTING_MAX_COMMENT_LENGTH,
  SETTING_MAX_THREAD_LENGTH,
} from '@/config/selectors';

export function GeneralSettingsView(): JSX.Element {
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
      <Stack gap={2} direction={{ xs: 'column', md: 'row' }}>
        <Stack flex={1}>
          <FormLabel>{t('MAXIMUM_COMMENT_LENGTH_LABEL')}</FormLabel>
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
        </Stack>
        <Stack flex={1}>
          <FormLabel>{t('MAXIMUM_THREAD_LENGTH_LABEL')}</FormLabel>
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
      </Stack>
    </Stack>
  );
}
