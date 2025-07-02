import { Stack, Typography } from '@mui/material';

export function NetworkErrorToast({
  title,
  description,
}: Readonly<{
  title: string;
  description?: string;
}>): JSX.Element {
  return (
    <Stack>
      <Typography fontWeight="bold">{title}</Typography>
      <Typography>{description}</Typography>
    </Stack>
  );
}

export function InfoToast({
  type,
  payload,
}: {
  type: string;
  payload: unknown;
}): JSX.Element {
  return (
    <Stack>
      <Typography fontWeight="bold">{type}</Typography>
      <Typography variant="caption">
        {JSON.stringify(payload, null, 2)}
      </Typography>
    </Stack>
  );
}
