import { useTranslation } from 'react-i18next';

import { Stack, TextField, Typography } from '@mui/material';

import { SETTING_MAX_COMMENT_LENGTH } from '@/config/selectors';

// type Props = {
//   // localSettings: GeneralSettings;
//   // changeSetting: (settingKey: string, newValue: string | boolean) => void;
// };

const DisplaySettings = (): JSX.Element => {
  const { t } = useTranslation();
  // todo: does not work ?
  return (
    <Stack>
      <Typography variant="subtitle2">{t('Maximum comment length')}</Typography>
      <TextField id={SETTING_MAX_COMMENT_LENGTH} type="number" />
    </Stack>
  );
};
export default DisplaySettings;
