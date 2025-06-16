import { Stack } from '@mui/material';

import ChatbotSettings from './ChatbotSettings';
import { GeneralSettingsView } from './GeneralSettingsView';

const SettingsView = (): JSX.Element => (
  <Stack spacing={1}>
    <ChatbotSettings />
    <GeneralSettingsView />
  </Stack>
);
export default SettingsView;
