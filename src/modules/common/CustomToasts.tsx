import { Stack, Typography } from '@mui/material';

function NetworkErrorToast({
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

function InfoToast({
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
        {JSON.stringify(payload, undefined, 2)}
      </Typography>
    </Stack>
  );
}

export { NetworkErrorToast, InfoToast };
