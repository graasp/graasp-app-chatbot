import { Trans, useTranslation } from 'react-i18next';

import { Link, Stack, Typography } from '@mui/material';

export function About() {
  const { t } = useTranslation();
  return (
    <Stack>
      <Typography variant="subtitle2" component="h3">
        {t('ABOUT_TITLE')}
      </Typography>
      <Typography variant="body2">{t('ABOUT_DESCRIPTION')}</Typography>
      <Typography variant="body2">
        <Trans i18nKey="ABOUT_PRIVACY_POLICY_OPENAI">
          The
          <Link href="https://openai.com/policies/eu-privacy-policy">
            Privacy policy
          </Link>
        </Trans>
      </Typography>
    </Stack>
  );
}
