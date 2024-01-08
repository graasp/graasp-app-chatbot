import { Avatar } from '@mui/material';

import { Member } from '@graasp/sdk';

import { ANONYMOUS_USER } from '@/constants';

// generate a background color for avatars from userName
const stringToColor = (name: string): string => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

const getInitials = (name: string): string =>
  name
    .split(/[^a-z]/i)
    .map((c) => Array.from(c).filter((l) => l.match(/[a-z]/i))[0])
    .join('');

type Props = {
  member?: Member;
  imgSrc?: string;
};

const CustomAvatar = ({ member, imgSrc }: Props): JSX.Element => {
  const userName = member?.name || ANONYMOUS_USER;
  return (
    <Avatar
      alt={userName}
      src={imgSrc}
      sx={{ bgcolor: stringToColor(userName) }}
    >
      {getInitials(userName)}
    </Avatar>
  );
};

export default CustomAvatar;
