import { styled } from '@mui/material';

import { BIG_BORDER_RADIUS } from '../../constants';

const CommentContainer = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  border: 'solid silver 1px',
  padding: theme.spacing(1, 0),
  borderRadius: BIG_BORDER_RADIUS,
}));
export default CommentContainer;
