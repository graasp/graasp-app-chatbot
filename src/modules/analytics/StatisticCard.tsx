import { Grid, Paper, Stack, Typography } from '@mui/material';

type Props = {
  icon: JSX.Element;
  title: string;
  stat: number | string;
};

const StatisticCard = ({ icon, title, stat }: Props): JSX.Element => (
  <Grid xs={12} md={6} lg={3} item>
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
        <Typography variant="h5" component="div">
          {stat}
        </Typography>
      </Stack>
    </Stack>
  </Grid>
);
export default StatisticCard;
