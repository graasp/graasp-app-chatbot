import { Paper, Stack, Typography } from '@mui/material';

type Props = {
  icon: JSX.Element;
  title: string;
  children: JSX.Element;
};

const StatisticCard = ({ icon, title, children }: Props): JSX.Element => (
  <Stack
    height="100%"
    component={Paper}
    p={2}
    variant="outlined"
    direction="row"
    alignItems="center"
  >
    {icon}
    <Stack flexGrow={1} direction="column" alignItems="center">
      <Typography align="center">{title}</Typography>
      {children}
    </Stack>
  </Stack>
);
export default StatisticCard;
