import { ReactNode } from 'react';

import { Stack, styled } from '@mui/material';

import { BIG_BORDER_RADIUS } from '@/constants';

const StyledContainer = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  border: 'solid silver 1px',
  padding: theme.spacing(3, 0),
  borderRadius: BIG_BORDER_RADIUS,
}));

export const ChatbotContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Stack
      sx={{
        px: { xs: 2, sm: 10 },
        maxWidth: '100ch',
        m: 'auto',
        height: '100%',
      }}
      gap={2}
    >
      <StyledContainer>{children}</StyledContainer>
    </Stack>
  );
};
