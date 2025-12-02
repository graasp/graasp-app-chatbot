import { useTranslation } from 'react-i18next';

import { Button, Stack, styled } from '@mui/material';

import { AppActionsType } from '@/config/appActions';
import { mutations } from '@/config/queryClient';
import { showErrorToast } from '@/utils/toast';

const StyledButton = styled(Button)({
  borderRadius: 100,
  textTransform: 'unset',
});

export function Suggestions({
  suggestions,
  send,
}: Readonly<{
  send: (message: string) => Promise<void>;
  suggestions: string[];
}>) {
  const { t } = useTranslation();
  const { mutateAsync: postAction } = mutations.usePostAppAction();

  const onClick = async (suggestion: string) => {
    try {
      await send(suggestion);
      await postAction({
        type: AppActionsType.UseStarter,
        data: { value: suggestion },
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        showErrorToast(e.message);
      }
      console.error(e);
    }
  };

  return (
    <Stack direction="row" gap={2} justifyContent="right">
      {suggestions.map((s) => (
        <span key={s}>
          <StyledButton
            aria-label={t('STARTER_SUGGESTION_PLAYER_BUTTON_ARIA_LABEL', {
              suggestion: s,
            })}
            onClick={() => onClick(s)}
            variant="contained"
          >
            {s}
          </StyledButton>
        </span>
      ))}
    </Stack>
  );
}
