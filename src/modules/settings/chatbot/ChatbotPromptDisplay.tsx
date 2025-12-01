import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';

type ChatbotPromptDisplayProps = {
  prompt?: string;
};

export function ChatbotPromptDisplay({
  prompt,
}: Readonly<ChatbotPromptDisplayProps>): JSX.Element {
  const { t } = useTranslation();

  if (!prompt) {
    return (
      <Typography color="text.disabled" fontStyle="italic">
        {t('The prompt is empty.')}
      </Typography>
    );
  }

  return (
    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
      {prompt}
    </Typography>
  );
}
