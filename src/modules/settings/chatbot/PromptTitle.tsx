import { FormLabel, Stack, Typography } from '@mui/material';

import { t } from 'i18next';

import { PromptDisplaySwitch, PromptDisplayType } from './PromptDisplaySwitch';

type Props = {
  view: PromptDisplayType;
  onChange: (view: PromptDisplayType) => void;
};

export function PromptTitle({ view, onChange }: Readonly<Props>): JSX.Element {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack>
        <FormLabel>{t('CHATBOT_PROMPT_LABEL')}</FormLabel>
        <Typography variant="caption" color="text.secondary">
          {t('CHATBOT_PROMPT_HELPER')}
        </Typography>
      </Stack>
      <PromptDisplaySwitch view={view} onChange={onChange} />
    </Stack>
  );
}
