import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { ChatbotModelSelect } from '../settings/ChatbotModelSelect';
import { GeneralSettingsView } from '../settings/GeneralSettingsView';

function AdvancedView() {
  const { t } = useTranslation();

  return (
    <Stack gap={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Typography variant="h2" fontWeight="bold" fontSize="1.5rem">
          {t('ADVANCED_TITLE')}
        </Typography>
      </Stack>
      <ChatbotModelSelect />
      <GeneralSettingsView />
    </Stack>
  );
}

export default AdvancedView;
