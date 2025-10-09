import { Avatar } from '@mui/material';

import type { Member } from '@graasp/sdk';
import { stringToColor } from '@graasp/ui/apps';

import { ANONYMOUS_USER } from '@/constants';
import { getInitials } from '@/utils/utils';

type Props = {
  member?: Member;
  imgSrc?: string;
};

function CustomAvatar({ member, imgSrc }: Readonly<Props>): JSX.Element {
  const userName = member?.name ?? ANONYMOUS_USER;
  return (
    <Avatar
      alt={userName}
      src={imgSrc}
      sx={{ bgcolor: stringToColor(userName) }}
    >
      {getInitials(userName)}
    </Avatar>
  );
}

export default CustomAvatar;
