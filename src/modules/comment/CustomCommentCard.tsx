import { Card, CardProps, styled } from '@mui/material';

import { BIG_BORDER_RADIUS } from '../../constants';

const CustomCommentCard = styled(Card)<CardProps>({
  borderRadius: BIG_BORDER_RADIUS,
});
export default CustomCommentCard;
