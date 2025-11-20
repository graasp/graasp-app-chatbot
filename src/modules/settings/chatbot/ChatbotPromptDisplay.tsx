import type { JSX } from 'react';

import { Box, Paper, Stack, Typography } from '@mui/material';

import { ChatBotMessage, ChatbotRole, ChatbotRoleType } from '@graasp/sdk';

type ChatbotPromptDisplayProps = {
  messages: ChatBotMessage[];
};

const roleColors: Record<ChatbotRoleType, string> = {
  [ChatbotRole.System]: '#bdbdbd',
  [ChatbotRole.Assistant]: '#1976d2',
  [ChatbotRole.User]: '#43a047',
};

const roleLabels: Record<ChatbotRoleType, string> = {
  [ChatbotRole.System]: 'System',
  [ChatbotRole.Assistant]: 'Assistant',
  [ChatbotRole.User]: 'User',
};

function justifyContentByRole(
  role: ChatbotRoleType,
): 'flex-end' | 'flex-start' | 'center' {
  if (role === ChatbotRole.User) {
    return 'flex-end';
  }
  if (role === ChatbotRole.Assistant) {
    return 'flex-start';
  }
  return 'center';
}

export function ChatbotPromptDisplay({
  messages,
}: Readonly<ChatbotPromptDisplayProps>): JSX.Element {
  return (
    <Stack spacing={2}>
      {messages.map((msg, idx) => (
        <Box
          key={idx}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: justifyContentByRole(msg.role),
          }}
        >
          <Paper
            elevation={2}
            sx={{
              px: 2,
              py: 1.5,
              maxWidth: '70%',
              borderRadius: 3,
              backgroundColor: roleColors[msg.role],
              color: msg.role === ChatbotRole.System ? '#333' : '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              position: 'relative',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                opacity: 0.8,
                mb: 0.5,
                display: 'block',
              }}
            >
              {roleLabels[msg.role]}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {msg.content}
            </Typography>
          </Paper>
        </Box>
      ))}
    </Stack>
  );
}
