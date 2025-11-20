import { ReactNode } from 'react';

import { FormLabel, Grid2, Stack, Typography } from '@mui/material';

type Props = { title: string; description: string; children: ReactNode };

export function ChatbotSetting({
  title,
  description,
  children,
}: Readonly<Props>): JSX.Element {
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={5}>
        <Stack>
          <FormLabel sx={{ fontSize: '1.2rem' }}>{title}</FormLabel>
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      </Grid2>
      <Grid2 size={7}>{children}</Grid2>
    </Grid2>
  );
}
