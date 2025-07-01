import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Alert,
  Badge,
  Box,
  Button,
  Link,
  Tab,
  Typography,
} from '@mui/material';

import { UnionOfConst } from '@graasp/sdk';

import { AlertTriangle, Info, MessageSquareText, Settings } from 'lucide-react';

import { GeneralSettings, SettingsKeys } from '@/config/appSetting';
import { hooks } from '@/config/queryClient';
import {
  BUILDER_VIEW_CY,
  SETTINGS_VIEW_PANE_CYPRESS,
  TABLE_VIEW_PANE_CYPRESS,
  TAB_ABOUT_VIEW_CYPRESS,
  TAB_SETTINGS_VIEW_CYPRESS,
  TAB_TABLE_VIEW_CYPRESS,
} from '@/config/selectors';

import SettingsView from '../settings/SettingsView';
import ConversationsView from './ConversationsView';

const Tabs = {
  TABLE_VIEW: 'TABLE_VIEW',
  SETTINGS_VIEW: 'SETTINGS_VIEW',
  ABOUT_VIEW: 'ABOUT_VIEW',
} as const;
type TabsType = UnionOfConst<typeof Tabs>;

function AdminView(): JSX.Element {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabsType>(Tabs.TABLE_VIEW);

  const { data: generalSettings } = hooks.useAppSettings<GeneralSettings>({
    name: SettingsKeys.ChatbotPrompt,
  });

  return (
    <Box data-cy={BUILDER_VIEW_CY}>
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
                invisible={generalSettings && generalSettings?.length > 0}
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
          <Tab
            data-cy={TAB_ABOUT_VIEW_CYPRESS}
            value={Tabs.ABOUT_VIEW}
            label={t('ABOUT_VIEW_TITLE')}
            icon={<Info />}
            iconPosition="start"
          />
        </TabList>

        <TabPanel value={Tabs.TABLE_VIEW} data-cy={TABLE_VIEW_PANE_CYPRESS}>
          {generalSettings?.length === 0 && (
            <Alert severity="warning">
              No config{' '}
              <Button onClick={() => setActiveTab(Tabs.SETTINGS_VIEW)}>
                Configure
              </Button>
            </Alert>
          )}
          <ConversationsView />
        </TabPanel>
        <TabPanel
          value={Tabs.SETTINGS_VIEW}
          data-cy={SETTINGS_VIEW_PANE_CYPRESS}
        >
          <SettingsView />
        </TabPanel>
        <TabPanel value={Tabs.ABOUT_VIEW} data-cy={SETTINGS_VIEW_PANE_CYPRESS}>
          <Typography variant="h6" component="h3">
            {t('ABOUT_TITLE')}
          </Typography>
          <Typography>{t('ABOUT_DESCRIPTION')}</Typography>
          <Typography>
            <Trans i18nKey="ABOUT_PRIVACY_POLICY_OPENAI">
              The
              <Link href="https://openai.com/policies/eu-privacy-policy">
                Privacy policy
              </Link>
            </Trans>
          </Typography>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default AdminView;
