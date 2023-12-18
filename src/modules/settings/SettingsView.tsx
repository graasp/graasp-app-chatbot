import { Stack } from '@mui/material';

import ChatbotSettings from './ChatbotSettings';
import GeneralSettingsView from './GeneralSettingsView';

const SettingsView = (): JSX.Element => (
  <Stack spacing={1}>
    <GeneralSettingsView />
    <ChatbotSettings />
  </Stack>
);
export default SettingsView;
