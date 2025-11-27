import { Button, Stack, styled } from '@mui/material';

import { ChatbotPromptSettings } from '@/config/appSetting';

import { useSendMessageAndAskChatbot } from './useSendMessageAndAskChatbot';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 100,
  textTransform: 'unset',
}));

export function Suggestions({
  suggestions,
  chatbotPrompt,
}: {
  chatbotPrompt: ChatbotPromptSettings;
  suggestions: string[];
}) {
  const { send } = useSendMessageAndAskChatbot({ chatbotPrompt });

  return (
    <Stack direction="row" gap={2} justifyContent="right">
      {suggestions.map((s) => (
        <span key={s}>
          <StyledButton onClick={() => send(s)} variant="contained">
            {s}
          </StyledButton>
        </span>
      ))}
    </Stack>
  );
}
