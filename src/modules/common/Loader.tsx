import { Box, Stack, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = ({
  children,
}: {
  children: JSX.Element | string;
}): JSX.Element => (
  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <CircularProgress size={20} />
      <Typography color="primary">Loading {children}</Typography>
    </Stack>
  </Box>
);

export default Loader;
