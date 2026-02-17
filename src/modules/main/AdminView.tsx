import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Alert,
  Badge,
  Box,
  Button,
  Stack,
  Tab,
  Typography,
} from '@mui/material';

import type { UnionOfConst } from '@graasp/sdk';

import { AlertTriangle, MessageSquareText, Settings } from 'lucide-react';

import { ChatbotPromptSettings, SettingsKeys } from '@/config/appSetting';
import { hooks } from '@/config/queryClient';
import {
  BUILDER_VIEW_CY,
  SETTINGS_VIEW_PANE_CYPRESS,
  TABLE_VIEW_PANE_CYPRESS,
  TAB_SETTINGS_VIEW_CYPRESS,
  TAB_TABLE_VIEW_CYPRESS,
} from '@/config/selectors';

import SettingsView from '../settings/SettingsView';
import ConversationsView from './ConversationsView';

const Tabs = {
  TABLE_VIEW: 'TABLE_VIEW',
  SETTINGS_VIEW: 'SETTINGS_VIEW',
} as const;
type TabsType = UnionOfConst<typeof Tabs>;

function AdminView(): JSX.Element {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabsType>(Tabs.SETTINGS_VIEW);

  const { data: chatbotPromptSettings } =
    hooks.useAppSettings<ChatbotPromptSettings>({
      name: SettingsKeys.ChatbotPrompt,
    });

  return (
    <Box data-cy={BUILDER_VIEW_CY} minHeight={500}>
      <TabContext value={activeTab}>
        <TabList
          textColor="secondary"
          indicatorColor="secondary"
          onChange={(_, newTab: TabsType) => setActiveTab(newTab)}
          centered
        >
          <Tab
            data-cy={TAB_SETTINGS_VIEW_CYPRESS}
            value={Tabs.SETTINGS_VIEW}
            label={t('SETTINGS_VIEW_TITLE')}
            icon={
              <Badge
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                invisible={
                  chatbotPromptSettings && 0 < chatbotPromptSettings?.length
                }
                badgeContent={<AlertTriangle size={14} />}
                color="warning"
              >
                <Settings />
              </Badge>
            }
            iconPosition="start"
          />
          <Tab
            data-cy={TAB_TABLE_VIEW_CYPRESS}
            value={Tabs.TABLE_VIEW}
            label={t('CONVERSATIONS_VIEW_TITLE')}
            icon={<MessageSquareText />}
            iconPosition="start"
          />
        </TabList>

        <TabPanel
          value={Tabs.SETTINGS_VIEW}
          data-cy={SETTINGS_VIEW_PANE_CYPRESS}
        >
          <Stack gap={5}>
            <SettingsView />
          </Stack>
        </TabPanel>
        <TabPanel value={Tabs.TABLE_VIEW} data-cy={TABLE_VIEW_PANE_CYPRESS}>
          {
            // oxlint-disable-next-line eslint/yoda
            chatbotPromptSettings?.length === 0 && (
              <Alert
                severity="warning"
                sx={{ mb: 2 }}
                action={
                  <Button onClick={() => setActiveTab(Tabs.SETTINGS_VIEW)}>
                    {t('CONFIGURE_BUTTON')}
                  </Button>
                }
              >
                <Typography>{t('CHATBOT_CONFIGURATION_MISSING')}</Typography>
              </Alert>
            )
          }
          <ConversationsView />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default AdminView;
