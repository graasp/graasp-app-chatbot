import { Grid, Paper, Stack, Typography } from '@mui/material';

type Props = {
  icon: JSX.Element;
  title: string;
  children: JSX.Element;
};

const StatisticCard = ({ icon, title, children }: Props): JSX.Element => (
  <Grid xs={12} md={4} item>
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
  </Grid>
);
export default StatisticCard;
